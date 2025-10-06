import {NextRequest, NextResponse} from 'next/server';
import pool from '@/lib/db';
import {RowDataPacket, ResultSetHeader } from 'mysql2';

//Get - Fetch all employees
export async function GET(){
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'Select * From employees Order BY id DESC'
        );

        return NextResponse.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        return NextResponse.json(
            {success: false, error: 'Failed to fetch employees'},
            {status: 500}
        );
    }
}

// POST - Create new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, phone, email, salary, startDate } = body;

    // Validation
    if (!name || !position || !phone || !email || !salary || !startDate) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Insert employee
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO employees (name, position, phone, email, salary, start_date) VALUES (?, ?, ?, ?, ?, ?)',
      [name, position, phone, email, salary, startDate]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        name,
        position,
        phone,
        email,
        salary,
        startDate
      }
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating employee:', error);
    
    // Handle duplicate email error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}

// PUT - Update employee
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, position, phone, email, salary, startDate } = body;

    // Validation
    if (!id || !name || !position || !phone || !email || !salary || !startDate) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Update employee
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE employees SET name = ?, position = ?, phone = ?, email = ?, salary = ?, start_date = ? WHERE id = ?',
      [name, position, phone, email, salary, startDate, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id, name, position, phone, email, salary, startDate }
    });
  } catch (error: unknown) {
    console.error('Error updating employee:', error);
    
    // Handle duplicate email error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// DELETE - Delete employee
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM employees WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}