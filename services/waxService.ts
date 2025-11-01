import axios from 'axios';
import { NFTAsset } from '@/types';

// WAX Cloud Wallet endpoints
const WAX_RPC_ENDPOINT = 'https://wax.greymass.com';
const ATOMICHUB_API = 'https://wax.api.atomicassets.io';

export class WaxService {
  private wax: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Dynamically import waxjs only in browser
      if (typeof window !== 'undefined') {
        const { WaxJS } = await import('@waxio/waxjs/dist');
        this.wax = new WaxJS({
          rpcEndpoint: WAX_RPC_ENDPOINT,
          tryAutoLogin: true,
        });
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Failed to initialize WAX:', error);
      throw error;
    }
  }

  async login(): Promise<string> {
    await this.initialize();
    
    if (!this.wax) {
      throw new Error('WAX not initialized');
    }

    try {
      const userAccount = await this.wax.login();
      return userAccount;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async isAutoLoginAvailable(): Promise<boolean> {
    await this.initialize();
    return this.wax ? await this.wax.isAutoLoginAvailable() : false;
  }

  async fetchUserNFTs(
    accountName: string,
    collectionName: string = 'futuresrelic'
  ): Promise<NFTAsset[]> {
    try {
      const response = await axios.get(`${ATOMICHUB_API}/atomicassets/v1/assets`, {
        params: {
          owner: accountName,
          collection_name: collectionName,
          page: 1,
          limit: 100,
          order: 'desc',
          sort: 'asset_id',
        },
      });

      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
      return [];
    }
  }

  async fetchTemplateInfo(templateId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${ATOMICHUB_API}/atomicassets/v1/templates/${templateId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch template info:', error);
      return null;
    }
  }

  async fetchCollectionStats(collectionName: string = 'futuresrelic'): Promise<any> {
    try {
      const response = await axios.get(
        `${ATOMICHUB_API}/atomicassets/v1/collections/${collectionName}/stats`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch collection stats:', error);
      return null;
    }
  }

  // Helper to get IPFS image URL
  getIpfsUrl(ipfsHash: string): string {
    if (!ipfsHash) return '';
    if (ipfsHash.startsWith('http')) return ipfsHash;
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }
}

export const waxService = new WaxService();
