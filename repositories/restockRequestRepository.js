import RestockRequest from "../db/models/restockRequest.model.js";

class RestockRequestRepository {
    async create(data) {
        return await RestockRequest.create(data);
    }

    async findById(id) {
        return await RestockRequest.findById(id)
        .populate("drugId", "name stockQuantity reorderLevel")
        .populate("requestedBy", "firstName lastName")
        .populate("approvedBy", "firstName lastName");
    }

    async findAll(filter = {}) {
        return await RestockRequest.find(filter)
        .populate("drugId", "name stockQuantity reorderLevel")
        .populate("requestedBy", "firstName lastName")
        .populate("approvedBy", "firstName lastName");
    }

    async updateById(id, updateData) {
        return await RestockRequest.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
    }

    async deleteById(id) {
        return await RestockRequest.findByIdAndDelete(id);
    }

    async getPending() {
        return await RestockRequest.getPending();
    }

    async approve(request, approvedById) {
        return await request.approve(approvedById);
    }

    async reject(request, approvedById, reason) {
        return await request.reject(approvedById, reason);
    }

    async fulfill(request, quantity) {
        return await request.fulfill(quantity);
    }
}

export default new RestockRequestRepository();