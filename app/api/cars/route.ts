import { NextRequest, NextResponse } from 'next/server';
import { getDb, deserializeCar } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM cars ORDER BY entryTime DESC').all() as Record<string, unknown>[];
  return NextResponse.json(rows.map(deserializeCar));
}

export async function POST(request: NextRequest) {
  const newCar = await request.json();
  const db = getDb();

  const car = {
    id: Date.now().toString(),
    licensePlate: newCar.licensePlate,
    zoneId: newCar.zoneId,
    entryTime: newCar.entryTime || new Date().toISOString(),
    exitTime: newCar.exitTime ?? null,
    ticketBoughtTime: newCar.ticketBoughtTime ?? null,
    ticketDuration: newCar.ticketDuration ?? null,
    ticketPrice: newCar.ticketPrice ?? null,
    hasPCN: newCar.hasPCN ? 1 : 0,
  };

  db.prepare(`
    INSERT INTO cars (id, licensePlate, zoneId, entryTime, exitTime, ticketBoughtTime, ticketDuration, ticketPrice, hasPCN)
    VALUES (@id, @licensePlate, @zoneId, @entryTime, @exitTime, @ticketBoughtTime, @ticketDuration, @ticketPrice, @hasPCN)
  `).run(car);

  return NextResponse.json(deserializeCar(car as Record<string, unknown>), { status: 201 });
}

export async function PUT(request: NextRequest) {
  const updatedCar = await request.json();
  const db = getDb();

  const existing = db.prepare('SELECT * FROM cars WHERE id = ?').get(updatedCar.id) as Record<string, unknown> | undefined;
  if (!existing) {
    return NextResponse.json({ error: 'Car not found' }, { status: 404 });
  }

  const merged = { ...existing, ...updatedCar, hasPCN: updatedCar.hasPCN != null ? (updatedCar.hasPCN ? 1 : 0) : existing.hasPCN };

  db.prepare(`
    UPDATE cars SET
      licensePlate = @licensePlate,
      zoneId = @zoneId,
      entryTime = @entryTime,
      exitTime = @exitTime,
      ticketBoughtTime = @ticketBoughtTime,
      ticketDuration = @ticketDuration,
      ticketPrice = @ticketPrice,
      hasPCN = @hasPCN
    WHERE id = @id
  `).run(merged);

  return NextResponse.json(deserializeCar(merged));
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const db = getDb();
  db.prepare('DELETE FROM cars WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
