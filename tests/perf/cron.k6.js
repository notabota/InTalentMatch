import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3001";
const CRON_SECRET = __ENV.CRON_SECRET || "dev-cron-secret";

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_duration: ["p(95)<30000"],
    http_req_failed: ["rate==0"],
  },
};

export default function () {
  const res = http.post(`${BASE_URL}/api/cron/premium`, null, {
    headers: { Authorization: `Bearer ${CRON_SECRET}` },
  });
  check(res, {
    "cron 200": (r) => r.status === 200,
    "summary present": (r) => {
      const body = r.json();
      return body && typeof body.renewed === "number";
    },
  });
}
