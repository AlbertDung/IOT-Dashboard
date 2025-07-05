#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

// Wi-Fi credentials
const char* ssid = "Hoi Lam Chi";          // Replace with your Wi-Fi SSID
const char* password = "bat4gmasai";    // Replace with your Wi-Fi password

// Flask server endpoint (use your PC's local IP)
const char* serverName = "http://192.168.1.6:5000/data";

// DHT11 configuration
#define DHTPIN 5       // D1 pin on NodeMCU = GPIO5
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// LDR (photoresistor) on analog pin
#define LDR_PIN A0

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int lightValue = analogRead(LDR_PIN); // 0–1023

  // Check for valid DHT reading
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
  } else {
    Serial.println("===== Sensor Data =====");
    Serial.print("Temperature: "); Serial.print(temperature); Serial.println(" °C");
    Serial.print("Humidity   : "); Serial.print(humidity); Serial.println(" %");
    Serial.print("Light      : "); Serial.println(lightValue);
    Serial.println("========================");
  }

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, serverName);  // Modern API (not deprecated)
    http.addHeader("Content-Type", "application/json");

    // Build JSON payload
    String jsonData = "{\"temperature\":" + String(temperature) +
                      ",\"humidity\":" + String(humidity) +
                      ",\"light\":" + String(lightValue) + "}";

    int responseCode = http.POST(jsonData);
    Serial.print("POST response code: ");
    Serial.println(responseCode);
    if (responseCode > 0) {
      String responseBody = http.getString();
      Serial.println("Server response: " + responseBody);
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }

  delay(5000); // Send every 5 seconds
}