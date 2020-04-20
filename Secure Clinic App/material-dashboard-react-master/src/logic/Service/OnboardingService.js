import registerUser from "logic/Admin/Network/registerUser";

class OnboardingService {
    async regUser(username,password) {
        return await registerUser(username,password);
    }
}