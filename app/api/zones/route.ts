import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ZONES_FILE = path.join(process.cwd(), 'zones.json');

interface LatLng {
  lat: number;
  lng: number;
}

interface Tariff {
  duration: string;
  price: number;
}

interface Zone {
  id: string;
  name: string;
  coordinates: LatLng[];
  color: string;
  tariffs?: Tariff[];
}

async function readZones(): Promise<Zone[]> {
  try {
    const data = await fs.readFile(ZONES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeZones(zones: Zone[]): Promise<void> {
  await fs.writeFile(ZONES_FILE, JSON.stringify(zones, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const zones = await readZones();
    return NextResponse.json(zones);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read zones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const zones = await readZones();
    
    const newZone: Zone = {
      id: Date.now().toString(),
      name: body.name,
      coordinates: body.coordinates,
      color: body.color,
      tariffs: body.tariffs || null
    };
    
    zones.push(newZone);
    await writeZones(zones);
    
    return NextResponse.json(newZone, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create zone' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const zones = await readZones();
    
    const index = zones.findIndex(z => z.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Zone not found' }, { status: 404 });
    }
    
    zones[index] = body;
    await writeZones(zones);
    
    return NextResponse.json(zones[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update zone' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const zones = await readZones();
    
    const filteredZones = zones.filter(z => z.id !== body.id);
    await writeZones(filteredZones);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete zone' }, { status: 500 });
  }
}
