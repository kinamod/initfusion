import { writeFile, readFile } from 'fs/promises';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';

const zonesFilePath = resolve(process.cwd(), 'zones.json');

async function readZones() {
  try {
    if (!existsSync(zonesFilePath)) {
      return [];
    }
    const data = await readFile(zonesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeZones(zones: any[]) {
  await writeFile(zonesFilePath, JSON.stringify(zones, null, 2), 'utf-8');
}

export async function GET() {
  const zones = await readZones();
  return NextResponse.json(zones);
}

export async function POST(request: NextRequest) {
  const newZone = await request.json();
  const zones = await readZones();
  newZone.id = Date.now().toString();
  zones.push(newZone);
  await writeZones(zones);
  return NextResponse.json(newZone, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const updatedZone = await request.json();
  const zones = await readZones();
  const index = zones.findIndex((z: any) => z.id === updatedZone.id);
  if (index !== -1) {
    zones[index] = updatedZone;
    await writeZones(zones);
    return NextResponse.json(updatedZone);
  }
  return NextResponse.json({ error: 'Zone not found' }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const zones = await readZones();
  const filteredZones = zones.filter((z: any) => z.id !== id);
  await writeZones(filteredZones);
  return NextResponse.json({ success: true });
}
