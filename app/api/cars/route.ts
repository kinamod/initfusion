import { writeFile, readFile } from 'fs/promises';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';

const carsFilePath = resolve(process.cwd(), 'cars.json');

async function readCars() {
  try {
    if (!existsSync(carsFilePath)) {
      return [];
    }
    const data = await readFile(carsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeCars(cars: any[]) {
  await writeFile(carsFilePath, JSON.stringify(cars, null, 2), 'utf-8');
}

export async function GET() {
  const cars = await readCars();
  return NextResponse.json(cars);
}

export async function POST(request: NextRequest) {
  const newCar = await request.json();
  const cars = await readCars();
  
  const carEntry = {
    id: Date.now().toString(),
    licensePlate: newCar.licensePlate,
    zoneId: newCar.zoneId,
    entryTime: newCar.entryTime || new Date().toISOString(),
    exitTime: null,
    ticketBoughtTime: null,
    ticketDuration: null, // in minutes
    ticketPrice: null,
  };
  
  cars.push(carEntry);
  await writeCars(cars);
  return NextResponse.json(carEntry, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const updatedCar = await request.json();
  const cars = await readCars();
  const index = cars.findIndex((c: any) => c.id === updatedCar.id);
  
  if (index !== -1) {
    cars[index] = { ...cars[index], ...updatedCar };
    await writeCars(cars);
    return NextResponse.json(cars[index]);
  }
  
  return NextResponse.json({ error: 'Car not found' }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const cars = await readCars();
  const filteredCars = cars.filter((c: any) => c.id !== id);
  await writeCars(filteredCars);
  return NextResponse.json({ success: true });
}
