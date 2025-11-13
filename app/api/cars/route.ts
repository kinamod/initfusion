import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CARS_FILE = path.join(process.cwd(), 'cars.json');

interface Car {
  id: string;
  licensePlate: string;
  zoneId: string;
  entryTime: string;
  exitTime: string | null;
  ticketBoughtTime: string | null;
  ticketDuration: number | null;
  ticketPrice: number | null;
  hasPCN?: boolean;
}

async function readCars(): Promise<Car[]> {
  try {
    const data = await fs.readFile(CARS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeCars(cars: Car[]): Promise<void> {
  await fs.writeFile(CARS_FILE, JSON.stringify(cars, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const cars = await readCars();
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read cars' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cars = await readCars();
    
    const newCar: Car = {
      id: Date.now().toString(),
      licensePlate: body.licensePlate,
      zoneId: body.zoneId,
      entryTime: body.entryTime || new Date().toISOString(),
      exitTime: null,
      ticketBoughtTime: null,
      ticketDuration: null,
      ticketPrice: null,
      hasPCN: false
    };
    
    cars.push(newCar);
    await writeCars(cars);
    
    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create car entry' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const cars = await readCars();
    
    const index = cars.findIndex(c => c.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    
    cars[index] = { ...cars[index], ...body };
    await writeCars(cars);
    
    return NextResponse.json(cars[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const cars = await readCars();
    
    const filteredCars = cars.filter(c => c.id !== body.id);
    await writeCars(filteredCars);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
