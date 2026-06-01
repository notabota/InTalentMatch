import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3001";
const EMAIL = __ENV.E2E_EMAIL || "alice@example.com";
const PASSWORD = __ENV.E2E_PASSWORD || "password123";

export const options = {
  scenarios: {
    completion: {
      executor: "constant-arrival-rate",
      rate: 50,
      timeUnit: "1s",
      duration: "5m",
      preAllocatedVUs: 50,
      maxVUs: 200,
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.02"],
  },
};

export function setup() {
  const res = http.post(
    `${BASE_URL}/api/account/login`,
    JSON.stringify({ email: EMAIL, password: PASSWORD }),
    { headers: { "Content-Type": "application/json" } },
  );
  check(res, { "login 200": (r) => r.status === 200 });
  const cookie = res.headers["Set-Cookie"];
  return { cookie };
}

export default function (data) {
  const headers = { Cookie: data.cookie };
  const r = http.get(`${BASE_URL}/api/request?type=consumer`, { headers });
  check(r, { "list 200": (r) => r.status === 200 });
}
