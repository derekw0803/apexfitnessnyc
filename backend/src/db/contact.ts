import { getDb } from "./client";

export type Contact = {
    id: string;
    first_name: string;
    last_name: string;
    phone?: string;
    email: string;
    created_at: string;
};

export async function getAllContacts(): Promise<Contact[]> {
    const { data, error } = await getDb()
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function getContactByLastName(lastName: string): Promise<Contact[]> {
    const { data, error } = await getDb()
        .from("contacts")
        .select("*")
        .eq("last_name", lastName);

    if (error) throw error;
    return data;
}

export async function addContact(body: {
    firstName: string;
    lastName: string;
    phone?: string;
    email: string;
}): Promise<Contact> {
    const { data, error } = await getDb()
        .from("contacts")
        .insert({
            first_name: body.firstName,
            last_name: body.lastName,
            phone: body.phone,
            email: body.email,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function editContact(
    lastName: string,
    updates: Partial<{ firstName: string; lastName: string; phone: string; email: string }>
): Promise<Contact> {
    const mapped: Partial<Omit<Contact, "id" | "created_at">> = {};
    if (updates.firstName !== undefined) mapped.first_name = updates.firstName;
    if (updates.lastName !== undefined) mapped.last_name = updates.lastName;
    if (updates.phone !== undefined) mapped.phone = updates.phone;
    if (updates.email !== undefined) mapped.email = updates.email;

    const { data, error } = await getDb()
        .from("contacts")
        .update(mapped)
        .eq("last_name", lastName)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteContact(lastName: string): Promise<void> {
    const { error } = await getDb()
        .from("contacts")
        .delete()
        .eq("last_name", lastName);

    if (error) throw error;
}
