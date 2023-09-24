import * as Sentry from "@sentry/node";
import crypto from "crypto";
import os from "os";

Sentry.init({
    dsn: "https://eb3d28077e7f80009ad801843d26dc1c@o1040380.ingest.sentry.io/4505936291561472",
    environment: 'production',
    // environment: "development",
    release: "1.0.3",
});

Sentry.setUser({
    id: generateUniqueId(
        JSON.stringify({
            userInfo: os.userInfo(),
        })
    ),
});

const jotDown = (event) => {
    Sentry.captureEvent({
        message: event["name"],
        extra: event["data"],
    });
};

// Function to generate a unique ID from given data
function generateUniqueId(data) {
    // Create a hash object using the SHA-256 algorithm
    const hash = crypto.createHash("sha256");
    // Update the hash with the data to be hashed (can be a string or a buffer)
    hash.update(data);
    // Generate a hexadecimal representation of the hash
    const uniqueId = hash.digest("hex");
    return uniqueId;
}

export default jotDown;
