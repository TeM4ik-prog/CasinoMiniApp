import { ApiRoute } from "@/types";
import { apiConfig } from "@/types/pagesConfig";

export class giftService implements ApiRoute {
    instance;
    baseUrl;

    constructor() {
        this.instance = apiConfig.gifts.baseInstance;
        this.baseUrl = apiConfig.gifts;
    }

    async getLastUpdate() {
        const { data } = await this.instance.get(`${this.baseUrl.lastUpdate}`)
        return data
    }


    async getGiftModels() {
        const { data } = await this.instance.get(`${this.baseUrl.giftModels}`)
        return data
    }


    async applyFilters(filters: any) {
        const { data } = await this.instance.post(this.baseUrl.applyFilters, filters)
        return data
    }


    async getUserFilters() {
        const { data } = await this.instance.get(`${this.baseUrl.userFilters}`)
        return data
    }
}


export const GiftService = new giftService()