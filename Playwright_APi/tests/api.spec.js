import { test, expect } from '@playwright/test';

test("API Routes Testing", async ({ request }) => {

  const createResponse = await request.post("http://localhost:3000/api/org", {
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
        "org_name":"Aiirbus",
        "org_id":"14"
    }
  });

  expect(createResponse.status()).toBe(201);

  const createData = await createResponse.json(); 
  console.log("Organization Created:", createData);

  const token = createData.token;
  const orgId = createData.org.id;
  //console.log(token)
  console.log({orgId});


  const getResponse = await request.get('http://localhost:3000/api/org', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  expect(getResponse.status()).toBe(200);
  console.log("All Organization:", await getResponse.json());


  const putResponse = await request.put(`http://localhost:3000/api/org/${orgId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: {
      "org_name":"Airbus",
      "org_id":"14"
    }
  });

  expect(putResponse.status()).toBe(200);
  const updatedData = await putResponse.json();
  console.log("Updated Organization:", updatedData);

  const deleteResponse = await request.delete(`http://localhost:3000/api/org/${orgId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  expect(deleteResponse.status()).toBe(202);


    // const getResponsed = await request.get(`http://localhost:5500/users/${userId}`, {
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
    // });
    // expect(getResponsed.status()).toBe(404);
});