import { queryClient } from "../lib/query-client";
import { deleteContact } from "../data";
import type { Route } from "./+types/destroy-contact";
import { redirect } from "react-router";

export async function clientAction({ params }: Route.ActionArgs) {
  await deleteContact(params.contactId);
  queryClient.invalidateQueries({ queryKey: ["contacts"] });
  return redirect("/");
}