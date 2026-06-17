import { NextRequest, NextResponse } from 'next/server';
import { getDb, deserializeZone } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM zones').all() as Record<string, unknown>[];
  return NextResponse.json(rows.map(deserializeZone));
}

export async function POST(request: NextRequest) {
  const newZone = await request.json();
  const db = getDb();

  const zone = {
    id: Date.now().toString(),
    name: newZone.name,
    coordinates: JSON.stringify(newZone.coordinates),
    color: newZone.color,
    tariffs: JSON.stringify(newZone.tariffs),
  };

  db.prepare(`
    INSERT INTO zones (id, name, coordinates, color, tariffs)
    VALUES (@id, @name, @coordinates, @color, @tariffs)
  `).run(zone);

  return NextResponse.json(deserializeZone(zone as Record<string, unknown>), { status: 201 });
}

export async function PUT(request: NextRequest) {
  const updatedZone = await request.json();
  const db = getDb();

  const existing = db.prepare('SELECT * FROM zones WHERE id = ?').get(updatedZone.id);
  if (!existing) {
    return NextResponse.json({ error: 'Zone not found' }, { status: 404 });
  }

  const serialized = {
    id: updatedZone.id,
    name: updatedZone.name,
    coordinates: JSON.stringify(updatedZone.coordinates),
    color: updatedZone.color,
    tariffs: JSON.stringify(updatedZone.tariffs),
  };

  db.prepare(`
    UPDATE zones SET name = @name, coordinates = @coordinates, color = @color, tariffs = @tariffs
    WHERE id = @id
  `).run(serialized);

  return NextResponse.json(deserializeZone(serialized as Record<string, unknown>));
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const db = getDb();
  db.prepare('DELETE FROM zones WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
