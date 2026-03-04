import Drug from "../db/models/Drug.model.js";

class DrugRepository {
    async create(data) {
        return await Drug.create(data);
    }

    async findById(id) {
        return await Drug.findById(id);
    }

    async findAll(filter = {}) {
        return await Drug.find(filter);
    }

    async updateById(id, updateData) {
        return await Drug.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async deleteById(id) {
        return await Drug.findByIdAndDelete(id);
    }

    async search(searchTerm) {
        return await Drug.search(searchTerm);
    }

    async getLowStock() {
        return await Drug.getLowStock();
    }

    async getExpired() {
        return await Drug.getExpired();
    }

    async addStock(id, quantity) {
        const drug = await this.findById(id);
        if (!drug) return null;
        return await drug.addStock(quantity);
    }

    async deductStock(id, quantity) {
        const drug = await this.findById(id);
        if (!drug) return null;
        return await drug.deductStock(quantity);
    }
}

export default new DrugRepository();