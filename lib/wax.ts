import * as waxjs from '@waxio/waxjs/dist';
import type { WAXAccount } from '@/types';

let wax: any = null;

export function initializeWax() {
  if (typeof window === 'undefined') return null;
  
  if (!wax) {
    wax = new waxjs.WaxJS({
      rpcEndpoint: 'https://wax.greymass.com',
      tryAutoLogin: false,
    });
  }
  return wax;
}

export async function loginWithWax(): Promise<WAXAccount | null> {
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

    return {
      accountName: userAccount,
      permission: 'active',
      publicKey: publicKey,
    };
  } catch (error) {
    console.error('WAX login error:', error);
    return null;
  }
}

export async function autoLogin(): Promise<WAXAccount | null> {
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

    return {
      accountName: userAccount,
      permission: 'active',
      publicKey: publicKey,
    };
  } catch (error) {
    console.error('WAX auto-login error:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  wax = null;
}

export function getWaxInstance() {
  return wax;
}