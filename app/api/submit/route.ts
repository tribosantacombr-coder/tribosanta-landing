import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nomeContato, whatsapp, nomeLoja, cnpj, endereco, cidade, estado, cep } = body;

    if (!nomeContato || !whatsapp || !nomeLoja || !cnpj || !endereco || !cidade || !estado || !cep) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");

    if (!spreadsheetId || !credentials.client_email) {
      return NextResponse.json({ error: "Configuração do Google Sheets incompleta." }, { status: 500 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const timestamp = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Leads!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, nomeContato, whatsapp, nomeLoja, cnpj, endereco, cidade, estado, cep]],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Sheets error:", err);
    return NextResponse.json({ error: "Erro ao salvar os dados." }, { status: 500 });
  }
}
