import { schema } from "@/lib/db/schema";
import { executeAction } from "@/lib/executeAction";
import db from "@/lib/db/db"

const signUp = async (formData) => {
    return executeAction({
        actionFn: async () => {
            const email = formData.get("email");
            const password = formData.get("password");
            const validatedData = schema.parse({ email, password });
            await db.user.create({
                data: {
                    email: validatedData.email,
                    password: validatedData.password,
                },
            
            });
        }
    });
};

export { signUp };