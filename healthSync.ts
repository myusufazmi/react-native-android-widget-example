import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { supabase } from '@/utils/supabase';
import 'react-native-health-connect';
// Ensure native Health Connect delegate is initialized
import {
  readRecords,
  ReadRecordsOptions,
  initialize,
  requestPermission,
  SdkAvailabilityStatus,
  getSdkStatus,
  getGrantedPermissions,
} from 'react-native-health-connect';

const HEALTH_SYNC_TASK = 'health-connect-sync';

// Setup Health Connect permissions
async function ensureHealthConnectSetup(): Promise<boolean> {
  try {
    const status = await getSdkStatus();
    console.log('Health Connect status:', status);
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
      await initialize();
      const permissions = await getGrantedPermissions();
      const hasRead = permissions.some(p => p.recordType === 'Steps' && p.accessType === 'read');
      const hasWrite = permissions.some(p => p.recordType === 'Steps' && p.accessType === 'write');
      if (!hasRead || !hasWrite) {
        await requestPermission([
          { accessType: 'read', recordType: 'Steps' },
          { accessType: 'write', recordType: 'Steps' },
        ]);
      }
      return true;
    }
  } catch (e) {
    console.error('Health Connect setup failed:', e);
  }
  return false;
}

// Define background sync task
TaskManager.defineTask(HEALTH_SYNC_TASK, async () => {
  try {
    console.log('BG sync started');
    const ready = await ensureHealthConnectSetup();
    if (!ready) return BackgroundFetch.BackgroundFetchResult.NoData;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const options: ReadRecordsOptions = {
      timeRangeFilter: { operator: 'between', startTime: start.toISOString(), endTime: now.toISOString() },
    };
    const resp = await readRecords('Steps', options);
    if (resp.records?.length) {
      const total = resp.records.reduce((s, r) => s + (r.count || 0), 0);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await supabase.from('profiles').update({ steps: total }).eq('id', user.id);
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error('BG sync error:', err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});
