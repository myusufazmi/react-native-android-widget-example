// `@expo/metro-runtime` MUST be the first import to ensure Fast Refresh works
// on web.
import '@expo/metro-runtime';
import './utils/i18n';
import { registerRootComponent } from 'expo';

import {
    registerWidgetConfigurationScreen,
    registerWidgetTaskHandler,
} from 'react-native-android-widget';

import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import { supabase } from '@/utils/supabase'
import { readRecords, ReadRecordsOptions, initialize, requestPermission, SdkAvailabilityStatus, getSdkStatus, getGrantedPermissions } from 'react-native-health-connect'
import { App } from './App';
import { widgetTaskHandler } from './widgets/WidgetTaskHandler';
import { WidgetConfigurationScreen } from './widgets/WidgetConfigurationScreen';

const HEALTH_SYNC_TASK = 'health-connect-sync'

// Improved Health Connect setup function
const ensureHealthConnectSetup = async () => {
    try {
        const status = await getSdkStatus()
        console.log(`[${new Date().toISOString()}] Health Connect status:`, status)

        if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
            // Initialize Health Connect
            const isInitialized = await initialize()
            console.log(`[${new Date().toISOString()}] Health Connect initialized:`, isInitialized)

            // Check existing permissions
            const permissions = await getGrantedPermissions()
            console.log(`[${new Date().toISOString()}] Current permissions:`, permissions)

            // Check for both read and write permissions
            const hasReadPermission = permissions.some(
                permission => permission.recordType === 'Steps' && permission.accessType === 'read'
            )
            const hasWritePermission = permissions.some(
                permission => permission.recordType === 'Steps' && permission.accessType === 'write'
            )

            if (!hasReadPermission || !hasWritePermission) {
                console.log(`[${new Date().toISOString()}] Requesting Health Connect permissions`)
                const request = await requestPermission([
                    {
                        accessType: 'read',
                        recordType: 'Steps'
                    },
                    {
                        accessType: 'write',
                        recordType: 'Steps'
                    }
                ])
                console.log(`[${new Date().toISOString()}] Permission request result:`, request)
            }

            return true
        } else {
            console.log(`[${new Date().toISOString()}] Health Connect SDK not available`)
            return false
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Health Connect setup failed:`, error)
        return false
    }
}

// Modify the background task
TaskManager.defineTask(HEALTH_SYNC_TASK, async () => {
    try {
        console.log(`[${new Date().toISOString()}] Background sync started`)

        // Initialize and check permissions first
        const isReady = await ensureHealthConnectSetup()
        if (!isReady) {
            console.log(`[${new Date().toISOString()}] Health Connect not ready, skipping sync`)
            return BackgroundFetch.BackgroundFetchResult.NoData
        }

        const now = new Date()
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const endTime = now

        console.log(`[${new Date().toISOString()}] Fetching steps data from ${startTime.toISOString()} to ${endTime.toISOString()}`)

        const options: ReadRecordsOptions = {
            timeRangeFilter: {
                operator: 'between',
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
            }
        }

        const response = await readRecords('Steps', options)
        console.log(`[${new Date().toISOString()}] Health Connect response:`, JSON.stringify(response, null, 2))

        if (response && Array.isArray(response.records) && response.records.length > 0) {
            const totalSteps = response.records.reduce((sum: number, record: any) => sum + (record.count || 0), 0)
            console.log(`[${new Date().toISOString()}] Calculated total steps: ${totalSteps}`)

            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                console.log(`[${new Date().toISOString()}] Updating steps for user: ${user.id}`)
                const { data, error } = await supabase
                    .from('profiles')
                    .update({ steps: totalSteps })
                    .eq('id', user.id)

                if (error) {
                    console.error(`[${new Date().toISOString()}] Failed to update steps in Supabase:`, error)
                } else {
                    console.log(`[${new Date().toISOString()}] Successfully updated steps in Supabase`)
                }
            }
        } else {
            console.log(`[${new Date().toISOString()}] No step records found for the period`)
        }

        return BackgroundFetch.BackgroundFetchResult.NewData
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Background sync failed:`, error)
        return BackgroundFetch.BackgroundFetchResult.Failed
    }
})

// Register background task
const registerBackgroundTask = async () => {
    try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(HEALTH_SYNC_TASK)
        console.log(`[${new Date().toISOString()}] Background task registration status:`, isRegistered)

        if (!isRegistered) {
            await BackgroundFetch.registerTaskAsync(HEALTH_SYNC_TASK, {
                minimumInterval: 15 * 60, // 15 minutes
                stopOnTerminate: false,
                startOnBoot: true,
            })
            console.log(`[${new Date().toISOString()}] Background task registered successfully`)
        } else {
            console.log(`[${new Date().toISOString()}] Background task already registered`)
        }

        // Get the task's status
        const status = await BackgroundFetch.getStatusAsync()
        console.log(`[${new Date().toISOString()}] Background fetch status:`, status)
    } catch (err) {
        console.error(`[${new Date().toISOString()}] Task registration failed:`, err)
    }
}

// Register the background task
registerBackgroundTask();
registerRootComponent(App);

// Register widget handlers
registerWidgetTaskHandler(widgetTaskHandler);
registerWidgetConfigurationScreen(WidgetConfigurationScreen);