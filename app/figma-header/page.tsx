import { FigmaHeader } from '@/components/FigmaHeader';

export default function FigmaHeaderPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF' }}>
      <FigmaHeader />
      <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
          Figma Header Design
        </h1>
        <p style={{ fontSize: '16px', lineHeight: '24px', color: '#666' }}>
          This page showcases the header component created from the Figma design import.
          The header is an exact match to the provided Figma design, without any design system constraints.
        </p>
      </main>
    </div>
  );
}
