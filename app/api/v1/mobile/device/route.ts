import { NextRequest, NextResponse } from 'next/server';

interface RegisteredDevice {
  device_token: string;
  platform: 'ios' | 'android';
  device_name?: string;
  os_version?: string;
  app_version?: string;
  user_id?: string;
  registered_at: string;
}

const memoryDeviceStore: Map<string, RegisteredDevice> = new Map();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { device_token, platform, device_name, os_version, app_version, user_id } = body;

    if (!device_token || !platform) {
      return NextResponse.json(
        { success: false, error: 'device_token and platform (ios|android) are required' },
        { status: 400 }
      );
    }

    const record: RegisteredDevice = {
      device_token,
      platform,
      device_name: device_name || 'Generic Device',
      os_version: os_version || 'unknown',
      app_version: app_version || '1.0.0',
      user_id: user_id || 'anonymous',
      registered_at: new Date().toISOString(),
    };

    memoryDeviceStore.set(device_token, record);

    return NextResponse.json({
      success: true,
      message: `Device successfully registered for ${platform.toUpperCase()} push notifications`,
      device_id: device_token.substring(0, 12) + '...',
      total_active_devices: memoryDeviceStore.size,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to register device' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    total_registered_devices: memoryDeviceStore.size,
    devices: Array.from(memoryDeviceStore.values()),
  });
}
