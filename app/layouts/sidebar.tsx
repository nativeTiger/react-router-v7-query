import {
  Form,
  Link,
  NavLink,
  Outlet,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router";
import type { Route } from "./+types/sidebar";
import { getContacts, type ContactRecord } from "../data";
import { queryClient } from "../lib/query-client";
import { Suspense, use } from "react";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const query = url.searchParams.get("q");

  const contactsPromise = queryClient.fetchQuery({
    queryKey: ["contacts", query],
    queryFn: () => getContacts(query),
  });

  return { contactsPromise, query };
}

export default function Sidebar({ loaderData }: Route.ComponentProps) {
  const { contactsPromise, query } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  return (
    <>
      <div id="sidebar">
        <h1>
          <Link to="about">React Router Contacts</Link>
        </h1>
        <div>
          <Form
            id="search-form"
            role="search"
            onChange={(event) => {
              const isFirstSearch = query === null;
              submit(event.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
          >
            <input
              aria-label="Search contacts"
              id="q"
              name="q"
              defaultValue={query || ""}
              placeholder="Search"
              type="search"
              className={searching ? "loading" : ""}
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <Navbar contactsPromise={contactsPromise} />
        </Suspense>
      </div>
      <div
        className={
          navigation.state === "loading" && !searching ? "loading" : ""
        }
        id="detail"
      >
        <Outlet />
      </div>
    </>
  );
}

function Navbar({
  contactsPromise,
}: {
  contactsPromise: Promise<ContactRecord[]>;
}) {
  const contacts = use(contactsPromise);

  return (
    <nav>
      {contacts.length ? (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "active" : isPending ? "pending" : ""
                }
                to={`contacts/${contact.id}`}
              >
                {contact.first || contact.last ? (
                  <>
                    {contact.first} {contact.last}
                  </>
                ) : (
                  <i>No Name</i>
                )}
                {contact.favorite ? <span>★</span> : null}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>No contacts</i>
        </p>
      )}
    </nav>
  );
}
