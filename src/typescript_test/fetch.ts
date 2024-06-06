import { z } from "zod";

const typeScheme = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

type userType = z.infer<typeof typeScheme>;

const fetchDatqa = async (): Promise<userType[]> => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();

    const result = typeScheme.array().safeParse(data);

    if (!result.success) {
      // Check if validation failed
      throw new Error("Validation failed"); // Throw an error
    }

    console.log("Validation successful:", result.data); // Log the validated data
    return result.data; // Return the validated dat
  } catch (error) {
    console.log("catching the error - ", (error as Error).message);
    return [];
  }
};

fetchDatqa().then();
