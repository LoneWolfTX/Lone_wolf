'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        window.location.reload();
      } else {
        setError(data?.error || 'Invalid administrator password. Access denied.');
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#090d16',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', position: 'relative', width: '64px', height: '64px', marginBottom: '16px' }}>
          <Image src="/images/lone-wolf/logo.png" alt="Lone Wolf Logo" fill style={{ objectFit: 'contain' }} priority />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display, "Montserrat", sans-serif)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '0.5px',
            marginBottom: '4px',
          }}
        >
          LONE WOLF <span style={{ color: '#e11d48' }}>STUDIO</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '28px' }}>
          Owner &amp; Site Management Authentication
        </p>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="admin-password"
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Master Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                required
                autoFocus
                style={{
                  width: '100%',
                  backgroundColor: '#020617',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '12px 16px 12px 40px',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            style={{
              width: '100%',
              backgroundColor: '#e11d48',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
              opacity: loading || !password.trim() ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying Session...</span>
              </>
            ) : (
              <>
                <span>Enter Owner Studio</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: '#64748b',
          }}
        >
          <ShieldCheck size={14} style={{ color: '#10b981' }} />
          <span>Server-Side HMAC-SHA256 Gated Access</span>
        </div>
      </div>
    </div>
  );
}
