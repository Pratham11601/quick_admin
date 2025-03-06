const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Admin Panel API",
      version: "1.0.0",
      description: "API documentation for Admin Panel",
      contact: {
        name: "Support Team",
        email: "support@example.com",
        url: "http://example.com",
      },
    },
    servers: [{ url: BASE_URL }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Vendor: {
          type: "object",
          required: ["fullname", "vendor_cat", "phone", "email", "password"],
          properties: {
            id: { type: "integer", example: 1 },
            fullname: { type: "string", example: "John Doe" },
            vendor_cat: { type: "string", example: "Cab" },
            phone: { type: "string", example: "9876543210" },
            aadhaar_number: { type: "string", example: "1234-5678-9012" },
            email: { type: "string", format: "email", example: "vendor@example.com" },
            password: { type: "string", format: "password", example: "securepassword" },
            profileImgUrl: { type: "string", format: "uri", example: "https://example.com/profile.jpg" },
            documentImgUrl: { type: "string", format: "uri", example: "https://example.com/document.jpg" },
            licenseImgUrl: { type: "string", format: "uri", example: "https://example.com/license.jpg" },
            currentAddress: { type: "string", example: "123 Street, City" },
            pin_code: { type: "string", example: "123456" },
            carnumber: { type: "string", example: "MH12AB1234" },
            vendor_gender: { type: "string", enum: ["Male", "Female", "Other"], example: "Male" },
            subscriptionPlan: { type: "string", example: "Premium" },
            subscription_date: { type: "string", format: "date-time", example: "2025-02-24T10:00:00Z" },
            businessName: { type: "string", example: "ABC Services" },
            city: { type: "string", example: "Mumbai" },
            status: { type: "integer", enum: [0, 1], example: 1 },
          },
        },
        Subscription: {
          type: "object",
          required: ["duration", "price"],
          properties: {
            id: { type: "integer", example: 1 },
            duration: { type: "string", example: "30 days" },
            price: { type: "number", example: 1000 },
            createdAt: { type: "string", format: "date-time", example: "2025-02-24T10:00:00Z" },
            updatedAt: { type: "string", format: "date-time", example: "2025-02-25T12:00:00Z" },
          },
        },
        Category: {
          type: "object",
          required: ["cat_name"],
          properties: {
            id: { type: "integer", example: 1 },
            cat_name: { type: "string", example: "Cab" },
          },
        },
        City: {
          type: "object",
          required: ["city_name"],
          properties: {
            city_id: { type: "integer", example: 1 },
            city_name: { type: "string", example: "Mumbai" },
            state_name: { type: "string", example: "Maharashtra" },
            created_at: { type: "string", format: "date-time", example: "2025-02-24T10:00:00Z" },
            updated_at: { type: "string", format: "date-time", example: "2025-02-24T12:00:00Z" },
          },
        },
        SubPackage: {
          type: "object",
          required: ["package_name", "duration_in_days", "price_per_day", "total_price"],
          properties: {
            id: { type: "integer", example: 1 },
            package_name: { type: "string", example: "Premium Plan" },
            duration_in_days: { type: "integer", example: 30 },
            price_per_day: { type: "number", example: 100 },
            total_price: { type: "number", example: 3000 },
            createdAt: { type: "string", format: "date-time", example: "2025-02-25T10:00:00Z" },
            updatedAt: { type: "string", format: "date-time", example: "2025-02-25T12:00:00Z" },
          },
        },
        HelpSupport: {
          type: "object",
          required: ["query_message", "vendor_category", "vendor_id", "vendor_contact", "vendor_name"],
          properties: {
            id: { type: "integer", example: 1 },
            query_message: { type: "string", example: "Cannot upload profile image" },
            vendor_category: { type: "string", example: "Cab" },
            vendor_id: { type: "integer", example: 362 },
            vendor_contact: { type: "string", example: "9890218723" },
            vendor_name: { type: "string", example: "Jitendra Babar" },
            remark: { type: "string", example: "Issue resolved" },
            remark_date: { type: "string", format: "date", example: "2025-02-26" },
            createdAt: { type: "string", format: "date-time", example: "2025-02-26T10:00:00Z" },
            updatedAt: { type: "string", format: "date-time", example: "2025-02-26T12:00:00Z" },
          },
        },
        Leads: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            date: { type: "string", format: "date", example: "2025-02-25" },
            vendor_id: { type: "integer", example: 10 },
            vendor_name: { type: "string", example: "John Doe" },
            location_from: { type: "string", example: "Delhi" },
            location_from_area: { type: "string", example: "Connaught Place" },
            car_model: { type: "string", example: "Toyota Innova" },
            add_on: { type: "string", example: "WiFi, AC" },
            fare: { type: "number", format: "float", example: 1500.50 },
            to_location: { type: "string", example: "Mumbai" },
            to_location_area: { type: "string", example: "Andheri" },
            time: { type: "string", example: "10:30 AM" },
            is_active: { type: "integer", enum: [0, 1], example: 1 },
            vendor_contact: { type: "string", example: "9876543210" },
            vendor_cat: { type: "string", example: "Cab" },
            createdAt: { type: "string", format: "date-time", example: "2025-02-25T10:00:00Z" },
            updatedAt: { type: "string", format: "date-time", example: "2025-02-25T12:00:00Z" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            status: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.js")], // Adjust path as needed
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  }));
};

module.exports = swaggerDocs;
