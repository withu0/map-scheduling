"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DatePicker } from "@/components/ui/date-picker";
import { geocodeAddress, calculateDistance } from "@/lib/mapbox";
import { SERVICE_AREA, DEFAULT_ADDRESS } from "@/lib/service-area";
import { testPlaces, type TestPlace } from "@/lib/test-places";
import { CheckCircle2, XCircle, Loader2, MapPin, Clock, FileText, Wrench } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const SERVICES = [
  { value: "standard", label: "Standard Service" },
  { value: "premium", label: "Premium Service" },
  { value: "express", label: "Express Service" },
  { value: "maintenance", label: "Maintenance" },
];

interface BookingFormData {
  service: string;
  date: Date | null;
  time: string;
  address: string;
  notes: string;
}

interface AddressValidation {
  isValid: boolean | null; // null = not checked yet, true = within radius, false = outside
  distance: number | null;
  isChecking: boolean;
}

export function BookingForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BookingFormData>({
    service: "",
    date: null,
    time: "",
    address: DEFAULT_ADDRESS.address,
    notes: "",
  });

  const [addressValidation, setAddressValidation] = useState<AddressValidation>({
    isValid: null,
    distance: null,
    isChecking: false,
  });

  const [selectedTestPlace, setSelectedTestPlace] = useState<string>("");

  // Validate address when it changes
  const validateAddress = useCallback(async (address: string) => {
    if (!address.trim()) {
      setAddressValidation({ isValid: null, distance: null, isChecking: false });
      return;
    }

    setAddressValidation((prev) => ({ ...prev, isChecking: true }));

    try {
      const result = await geocodeAddress(address);
      if (result) {
        const distance = calculateDistance(SERVICE_AREA.center, result.coordinates);
        const isValid = distance <= SERVICE_AREA.radiusKm;

        setAddressValidation({
          isValid,
          distance,
          isChecking: false,
        });

        // Update address with the geocoded address if it's different
        if (result.address !== address) {
          setFormData((prev) => ({ ...prev, address: result.address }));
        }
      } else {
        setAddressValidation({
          isValid: false,
          distance: null,
          isChecking: false,
        });
        toast({
          variant: "destructive",
          title: "Address not found",
          description: "Could not find the specified address. Please try again.",
        });
      }
    } catch (error) {
      console.error("Address validation error:", error);
      setAddressValidation({
        isValid: false,
        distance: null,
        isChecking: false,
      });
      toast({
        variant: "destructive",
        title: "Validation error",
        description: error instanceof Error ? error.message : "Failed to validate address.",
      });
    }
  }, [toast]);

  // Validate default address on mount
  useEffect(() => {
    validateAddress(DEFAULT_ADDRESS.address);
  }, [validateAddress]);

  // Debounced address validation
  useEffect(() => {
    if (!formData.address || formData.address === DEFAULT_ADDRESS.address) {
      return;
    }

    const timeoutId = setTimeout(() => {
      validateAddress(formData.address);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [formData.address, validateAddress]);

  const handleTestPlaceSelect = (placeId: string) => {
    const place = testPlaces.find((p) => p.name === placeId);
    if (place) {
      setFormData((prev) => ({ ...prev, address: place.address }));
      setSelectedTestPlace(placeId);
      validateAddress(place.address);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.service || !formData.date || !formData.time || !formData.address) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (addressValidation.isValid === false) {
      toast({
        variant: "destructive",
        title: "Address out of service area",
        description: `The address is ${addressValidation.distance?.toFixed(1)} km away, which is outside our ${SERVICE_AREA.radiusKm} km service radius.`,
      });
      return;
    }

    // In a real app, this would submit to a backend
    toast({
      title: "Booking submitted!",
      description: `Your ${SERVICES.find(s => s.value === formData.service)?.label} booking for ${format(formData.date!, "PPP")} at ${formData.time} has been received.`,
    });

    // Reset form
    setFormData({
      service: "",
      date: null,
      time: "",
      address: DEFAULT_ADDRESS.address,
      notes: "",
    });
    setSelectedTestPlace("");
    validateAddress(DEFAULT_ADDRESS.address);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Customer Booking
        </CardTitle>
        <CardDescription>
          Book a service appointment. We'll validate your address in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Service Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.service}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, service: value }))}
            >
              <SelectTrigger id="service">
                <SelectValue placeholder="Select a service..." />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Date <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                date={formData.date || new Date()}
                onDateChange={(date) => setFormData((prev) => ({ ...prev, date: date || null }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">
                Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Test Places Selector */}
          <div className="space-y-2">
            <Label htmlFor="test-place">Quick Select (Test Places)</Label>
            <Select value={selectedTestPlace} onValueChange={handleTestPlaceSelect}>
              <SelectTrigger id="test-place">
                <SelectValue placeholder="Select a test location to auto-fill..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Within Service Area</SelectLabel>
                  {testPlaces
                    .filter((p) => p.withinRadius)
                    .map((place) => (
                      <SelectItem key={place.name} value={place.name}>
                        ✓ {place.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Outside Service Area</SelectLabel>
                  {testPlaces
                    .filter((p) => !p.withinRadius)
                    .map((place) => (
                      <SelectItem key={place.name} value={place.name}>
                        ✗ {place.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Address Input */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, address: e.target.value }));
                setSelectedTestPlace(""); // Clear test place selection when manually typing
              }}
              placeholder="Enter your address..."
              required
            />
            
            {/* Address Validation Status */}
            {formData.address && (
              <div className="mt-2">
                {addressValidation.isChecking ? (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>Validating address...</AlertDescription>
                  </Alert>
                ) : addressValidation.isValid === true ? (
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      ✓ Address is within service area
                      {addressValidation.distance !== null && (
                        <span className="ml-2">
                          ({addressValidation.distance.toFixed(1)} km from service center)
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : addressValidation.isValid === false ? (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      ✗ Address is outside service area
                      {addressValidation.distance !== null && (
                        <span className="ml-2">
                          ({addressValidation.distance.toFixed(1)} km away, service radius is{" "}
                          {SERVICE_AREA.radiusKm} km)
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : null}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special instructions or requirements..."
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={addressValidation.isChecking || addressValidation.isValid === false}
          >
            {addressValidation.isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Submit Booking"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

