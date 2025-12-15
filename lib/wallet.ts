import * as waxjs from '@waxio/waxjs/dist';
import AnchorLink from 'anchor-link';
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport';
import type { WAXAccount } from '@/types';

export type WalletType = 'wcw' | 'anchor';

// WAX Cloud Wallet instance
let wax: any = null;

// Anchor instance
let anchor: AnchorLink | null = null;
let anchorSession: any = null;

// Track which wallet is being used
let activeWallet: WalletType | null = null;

// Initialize WAX Cloud Wallet
function initializeWax() {
  if (typeof window === 'undefined') return null;

  if (!wax) {
    wax = new waxjs.WaxJS({
      rpcEndpoint: 'https://wax.greymass.com',
      tryAutoLogin: false,
    });
  }
  return wax;
}

// Initialize Anchor
function initializeAnchor() {
  if (typeof window === 'undefined') return null;

  if (!anchor) {
    const transport = new AnchorLinkBrowserTransport();
    anchor = new AnchorLink({
      transport,
      chains: [
        {
          chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
          nodeUrl: 'https://wax.greymass.com',
        },
      ],
    });
  }
  return anchor;
}

// Login with WAX Cloud Wallet
export async function loginWithWCW(): Promise<WAXAccount | null> {
  try {
    const waxInstance = initializeWax();
    if (!waxInstance) return null;

    const userAccount = await waxInstance.login();

    let publicKey = '';
    try {
      if (waxInstance.pubKeys && waxInstance.pubKeys.length > 0) {
        publicKey = waxInstance.pubKeys[0];
      }
    } catch (e) {
      console.log('Could not get public key');
    }

    activeWallet = 'wcw';
    localStorage.setItem('activeWallet', 'wcw');

    return {
      accountName: userAccount,
      permission: 'active',
      publicKey: publicKey,
    };
  } catch (error) {
    console.error('WCW login error:', error);
    return null;
  }
}

// Login with Anchor
export async function loginWithAnchor(): Promise<WAXAccount | null> {
  try {
    const anchorInstance = initializeAnchor();
    if (!anchorInstance) return null;

    // Perform login
    const identity = await anchorInstance.login('futuresrelic');
    const session = identity.session;
    anchorSession = session;

    activeWallet = 'anchor';
    localStorage.setItem('activeWallet', 'anchor');
    localStorage.setItem('anchorSession', JSON.stringify({
      auth: session.auth,
      publicKey: session.publicKey.toString(),
    }));

    return {
      accountName: session.auth.actor.toString(),
      permission: session.auth.permission.toString(),
      publicKey: session.publicKey.toString(),
    };
  } catch (error) {
    console.error('Anchor login error:', error);
    return null;
  }
}

// Auto-login for WAX Cloud Wallet
async function autoLoginWCW(): Promise<WAXAccount | null> {
  try {
    const waxInstance = initializeWax();
    if (!waxInstance) return null;

    const isAutoLoginAvailable = await waxInstance.isAutoLoginAvailable();
    if (!isAutoLoginAvailable) return null;

    const userAccount = await waxInstance.login();

    let publicKey = '';
    try {
      if (waxInstance.pubKeys && waxInstance.pubKeys.length > 0) {
        publicKey = waxInstance.pubKeys[0];
      }
    } catch (e) {
      console.log('Could not get public key');
    }

    activeWallet = 'wcw';

    return {
      accountName: userAccount,
      permission: 'active',
      publicKey: publicKey,
    };
  } catch (error) {
    console.error('WCW auto-login error:', error);
    return null;
  }
}

// Auto-login for Anchor
async function autoLoginAnchor(): Promise<WAXAccount | null> {
  try {
    const anchorInstance = initializeAnchor();
    if (!anchorInstance) return null;

    // Restore session from localStorage
    const savedSession = localStorage.getItem('anchorSession');
    if (!savedSession) return null;

    const session = await anchorInstance.restoreSession('futuresrelic');

    if (!session) return null;

    anchorSession = session;
    activeWallet = 'anchor';

    return {
      accountName: session.auth.actor.toString(),
      permission: session.auth.permission.toString(),
      publicKey: session.publicKey.toString(),
    };
  } catch (error) {
    console.error('Anchor auto-login error:', error);
    localStorage.removeItem('anchorSession');
    return null;
  }
}

// Auto-login (tries last used wallet)
export async function autoLogin(): Promise<WAXAccount | null> {
  const lastWallet = localStorage.getItem('activeWallet') as WalletType | null;

  if (lastWallet === 'anchor') {
    const result = await autoLoginAnchor();
    if (result) return result;
  }

  if (lastWallet === 'wcw') {
    const result = await autoLoginWCW();
    if (result) return result;
  }

  return null;
}

// Logout
export async function logout(): Promise<void> {
  if (activeWallet === 'anchor' && anchorSession) {
    try {
      await anchorSession.remove();
    } catch (error) {
      console.error('Error removing Anchor session:', error);
    }
    anchorSession = null;
    localStorage.removeItem('anchorSession');
  }

  wax = null;
  anchor = null;
  activeWallet = null;
  localStorage.removeItem('activeWallet');
}

// Get active wallet type
export function getActiveWallet(): WalletType | null {
  return activeWallet;
}
