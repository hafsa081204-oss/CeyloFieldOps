'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type Payment = {
  id: string
  amount: number
  status: string
  invoiceNo: string
  createdAt: string
  job: {
    title: string
    description: string
    location: string
    status: string
    priority: string
    createdAt: string
    completedAt: string | null
    client: { name: string; email: string }
    worker: { user: { name: string; email: string }; location: string } | null
  }
}

export default function InvoicePage() {
  const { id } = useParams()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/payments/${id}`)
      .then(r => r.json())
      .then(data => {
        if (!data.error) setPayment(data)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, fontFamily: 'Jost', color: '#A8A49C' }}>
      Loading invoice...
    </div>
  )

  if (!payment) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, fontFamily: 'Jost', color: '#A8A49C' }}>
      Invoice not found.
    </div>
  )

  const statusColor: Record<string, string> = {
    PENDING: '#92600A',
    PAID: '#065F46',
    OVERDUE: '#C0392B',
  }

  const statusBg: Record<string, string> = {
    PENDING: '#FEF3CD',
    PAID: '#D1FAE5',
    OVERDUE: '#FDECEA',
  }

  const tax = payment.amount * 0.0
  const total = payment.amount + tax

  return (
    <div style={{ fontFamily: 'Jost' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500;600&display=swap');
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .invoice-wrapper { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      {/* Action Bar - no print */}
      <div className="no-print" style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <Link href="/dashboard/payments" style={{
          color: '#6B6860', fontSize: 13, textDecoration: 'none', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          ← Back to Payments
        </Link>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => window.print()}
          style={{
            background: '#2C4A3E', color: '#fff', border: 'none',
            padding: '11px 28px', borderRadius: 8, fontSize: 14,
            fontFamily: 'Jost', fontWeight: 500, cursor: 'pointer',
          }}
        >
          🖨️ Print Invoice
        </button>
        <button
          onClick={() => window.print()}
          style={{
            background: '#F5EDD8', color: '#B8964E', border: '1.5px solid #B8964E',
            padding: '11px 28px', borderRadius: 8, fontSize: 14,
            fontFamily: 'Jost', fontWeight: 500, cursor: 'pointer',
          }}
        >
          📄 Save as PDF
        </button>
      </div>

      {/* Invoice Document */}
      <div className="invoice-wrapper" style={{
        background: '#fff',
        border: '1px solid #E4E0D8',
        borderRadius: 12,
        padding: '56px 64px',
        maxWidth: 800,
        margin: '0 auto',
        boxShadow: '0 4px 24px #00000010',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, paddingBottom: 32, borderBottom: '2px solid #1C1C1A' }}>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 36, fontWeight: 400, color: '#1C1C1A', marginBottom: 4 }}>
              Ceylo<span style={{ color: '#2C4A3E' }}>Field</span>Ops
            </div>
            <div style={{ fontSize: 11, color: '#A8A49C', letterSpacing: '0.2em', marginBottom: 12 }}>
              FIELD SERVICE MANAGEMENT SYSTEM
            </div>
            <div style={{ fontSize: 13, color: '#6B6860', lineHeight: 1.6 }}>
              Advanced Technological Institute<br />
              Kandy, Sri Lanka<br />
              info@ceylofieldops.lk
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 42, fontWeight: 300, color: '#1C1C1A', marginBottom: 8 }}>
              INVOICE
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#2C4A3E', marginBottom: 8 }}>
              {payment.invoiceNo}
            </div>
            <div style={{
              display: 'inline-block',
              background: statusBg[payment.status] || '#FEF3CD',
              color: statusColor[payment.status] || '#92600A',
              fontSize: 12, fontWeight: 700,
              padding: '6px 16px', borderRadius: 20,
              letterSpacing: '0.1em',
            }}>
              {payment.status}
            </div>
          </div>
        </div>

        {/* Bill To / Invoice Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#A8A49C', letterSpacing: '0.2em', marginBottom: 12 }}>
              BILL TO
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A', marginBottom: 4 }}>
              {payment.job.client.name}
            </div>
            <div style={{ fontSize: 13, color: '#6B6860', lineHeight: 1.7 }}>
              {payment.job.client.email}<br />
              Sri Lanka
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#A8A49C', letterSpacing: '0.2em', marginBottom: 12 }}>
              INVOICE DETAILS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['Invoice No.', payment.invoiceNo],
                ['Issue Date', new Date(payment.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })],
                ['Job Location', payment.job.location],
                ['Assigned Worker', payment.job.worker?.user.name || 'N/A'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#A8A49C', fontWeight: 500 }}>{label}:</span>
                  <span style={{ color: '#1C1C1A', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
          <thead>
            <tr style={{ background: '#2C4A3E' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' }}>SERVICE DESCRIPTION</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' }}>PRIORITY</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' }}>STATUS</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' }}>AMOUNT (LKR)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#FAFAF7', borderBottom: '1px solid #E4E0D8' }}>
              <td style={{ padding: '16px', verticalAlign: 'top' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1C1C1A', marginBottom: 4 }}>
                  {payment.job.title}
                </div>
                <div style={{ fontSize: 12, color: '#A8A49C', lineHeight: 1.5 }}>
                  {payment.job.description || 'Field service work completed'}<br />
                  Location: {payment.job.location}
                </div>
              </td>
              <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'top' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1C1C1A' }}>
                  {payment.job.priority}
                </span>
              </td>
              <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'top' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#065F46', background: '#D1FAE5', padding: '3px 10px', borderRadius: 12 }}>
                  {payment.job.status.replace('_', ' ')}
                </span>
              </td>
              <td style={{ padding: '16px', textAlign: 'right', verticalAlign: 'top' }}>
                <span style={{ fontFamily: 'Cormorant Garamond', fontSize: 20, fontWeight: 500, color: '#1C1C1A' }}>
                  {payment.amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 48 }}>
          <div style={{ width: 300 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E4E0D8', fontSize: 13 }}>
              <span style={{ color: '#6B6860' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>LKR {payment.amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E4E0D8', fontSize: 13 }}>
              <span style={{ color: '#6B6860' }}>Tax (0%)</span>
              <span style={{ fontWeight: 600 }}>LKR 0.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', background: '#2C4A3E', paddingLeft: 16, paddingRight: 16, marginTop: 4 }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>TOTAL AMOUNT</span>
              <span style={{ color: '#fff', fontFamily: 'Cormorant Garamond', fontSize: 22, fontWeight: 400 }}>
                LKR {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Status Banner */}
        {payment.status === 'PAID' && (
          <div style={{ textAlign: 'center', padding: '16px', background: '#D1FAE5', borderRadius: 8, marginBottom: 32, border: '2px solid #6EE7B7' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#065F46', letterSpacing: '0.1em' }}>
              ✅ PAYMENT RECEIVED — THANK YOU
            </div>
          </div>
        )}

        {payment.status === 'PENDING' && (
          <div style={{ textAlign: 'center', padding: '16px', background: '#FEF3CD', borderRadius: 8, marginBottom: 32, border: '2px solid #FCD34D' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#92600A' }}>
              ⏳ PAYMENT PENDING — Please process at your earliest convenience
            </div>
          </div>
        )}

        {payment.status === 'OVERDUE' && (
          <div style={{ textAlign: 'center', padding: '16px', background: '#FDECEA', borderRadius: 8, marginBottom: 32, border: '2px solid #FCA5A5' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#C0392B' }}>
              ⚠️ PAYMENT OVERDUE — Immediate payment required
            </div>
          </div>
        )}

        {/* Notes */}
        <div style={{ padding: '20px', background: '#FAFAF7', borderRadius: 8, marginBottom: 32, border: '1px solid #E4E0D8' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#A8A49C', letterSpacing: '0.15em', marginBottom: 8 }}>
            NOTES & TERMS
          </div>
          <div style={{ fontSize: 13, color: '#6B6860', lineHeight: 1.7 }}>
            • Payment should be made within 30 days of invoice date.<br />
            • Please reference the invoice number {payment.invoiceNo} in all correspondence.<br />
            • For queries regarding this invoice, please contact your account manager.<br />
            • This is a computer-generated invoice from CeyloFieldOps system.
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #E4E0D8', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#A8A49C' }}>
            CeyloFieldOps — AI-Powered Field Service Management<br />
            Advanced Technological Institute, Kandy, Sri Lanka
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 18, color: '#2C4A3E' }}>
              Ceylo<span style={{ fontWeight: 600 }}>Field</span>Ops
            </div>
            <div style={{ fontSize: 11, color: '#A8A49C' }}>ceylofieldops.lk</div>
          </div>
        </div>
      </div>
    </div>
  )
}