import { NextRequest, NextResponse } from 'next/server';
import { searchSynonyms, addSynonym } from '@/lib/synonyms';
import { ApiResponse, AddSynonymRequest, AddSynonymResponse } from '@/lib/types';

// GET /api/synonyms?word=happy
export async function GET(request: NextRequest) {
  try {
    // izvlacenje query parametra
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word');

    //validacija
    if (!word) {
      return NextResponse.json({
        success: false,
        message: 'Word parameter is required'
      } as ApiResponse, { status: 400 });
    }

    //business logika
    const result = searchSynonyms(word);
    
    //response za uspjeh
    return NextResponse.json({
      success: true,
      data: result
    } as ApiResponse);

  } catch (error) {
    console.error('Error searching synonyms:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse, { status: 500 });
  }
}

// POST /api/synonyms
export async function POST(request: NextRequest) {
  try {
    //parsiranje JSON bodya
    const body: AddSynonymRequest = await request.json();
    const { word, synonym } = body;

    //validacija
    if (!word || !synonym) {
      return NextResponse.json({
        success: false,
        message: 'Both word and synonym are required'
      } as AddSynonymResponse, { status: 400 });
    }

    //business logika
    addSynonym(word, synonym);

    //response za uspjeh
    return NextResponse.json({
      success: true,
      message: `Successfully added "${word}" ⟷ "${synonym}"`
    } as AddSynonymResponse);

  } catch (error) {
    console.error('Error adding synonym:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return NextResponse.json({
      success: false,
      message: errorMessage
    } as AddSynonymResponse, { status: 400 });
  }
}