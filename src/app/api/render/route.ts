import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { projectId, quality } = await request.json();

        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const REPO_OWNER = 'calvin316byBoxesMedia360';
        const REPO_NAME = 'Digital-Menu-Studio-v2';
        const WORKFLOW_ID = 'render-video.yml';

        if (!GITHUB_TOKEN) {
            console.error('❌ Error: GITHUB_TOKEN no configurado en el servidor');
            return NextResponse.json(
                { error: 'Error de configuración del servidor' },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_ID}/dispatches`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github+json',
                    'Content-Type': 'application/json',
                    'X-GitHub-Api-Version': '2022-11-28',
                },
                body: JSON.stringify({
                    ref: 'main',
                    inputs: {
                        projectId,
                        quality
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Error de GitHub API:', errorData);
            return NextResponse.json(
                { error: 'Error al disparar el renderizado en GitHub' },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Error en /api/render:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
