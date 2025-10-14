import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit,
  Building,
  Calendar,
  User,
  Download,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  Star,
  Trash2,
} from "lucide-react";

interface OfficialInformationProps {
  data: any;
  canEdit: boolean;
  isEditMode?: boolean;
  onChange?: (field: string, value: any) => void;
}

const OfficialInformation: React.FC<OfficialInformationProps> = ({
  data,
  canEdit,
  isEditMode = false,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Level</TabsTrigger>
          <TabsTrigger value="confirmation">Confirmation Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Personal Level Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-primary">
                  <User className="h-5 w-5 mr-2" />
                  Personal Level (Highlighted)
                </CardTitle>
                <CardDescription>
                  Core employment and role information
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={data.firstName || ""}
                        onChange={(e) =>
                          onChange?.("firstName", e.target.value)
                        }
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={data.lastName || ""}
                        onChange={(e) => onChange?.("lastName", e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="knownAs">Known As</Label>
                      <Input
                        id="knownAs"
                        value={data.knownAs || ""}
                        onChange={(e) => onChange?.("knownAs", e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfJoining">Date of Joining</Label>
                      <Input
                        id="dateOfJoining"
                        type="date"
                        value={data.dateOfJoining || ""}
                        onChange={(e) =>
                          onChange?.("dateOfJoining", e.target.value)
                        }
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobConfirmation">Job Confirmation</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="jobConfirmation"
                          checked={data.jobConfirmation || false}
                          onCheckedChange={(checked) =>
                            onChange?.("jobConfirmation", checked)
                          }
                          disabled={!canEdit}
                        />
                        <Label htmlFor="jobConfirmation" className="text-sm">
                          Confirmed
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={data.role || ""}
                        onChange={(e) => onChange?.("role", e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={data.designation || ""}
                        onChange={(e) =>
                          onChange?.("designation", e.target.value)
                        }
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stream">Stream</Label>
                      <Input
                        id="stream"
                        value={data.stream || ""}
                        onChange={(e) => onChange?.("stream", e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subStream">Sub Stream</Label>
                      <Input
                        id="subStream"
                        value={data.subStream || ""}
                        onChange={(e) =>
                          onChange?.("subStream", e.target.value)
                        }
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="baseLocation">Base Location</Label>
                      <Input
                        id="baseLocation"
                        value={data.baseLocation || ""}
                        onChange={(e) =>
                          onChange?.("baseLocation", e.target.value)
                        }
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentLocation">Current Location</Label>
                      <Input
                        id="currentLocation"
                        value={data.currentLocation || ""}
                        onChange={(e) =>
                          onChange?.("currentLocation", e.target.value)
                        }
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={data.unit || ""}
                        onChange={(e) => onChange?.("unit", e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitHead">Unit Head</Label>
                      <Input
                        id="unitHead"
                        value={data.unitHead || ""}
                        onChange={(e) => onChange?.("unitHead", e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        First Name
                      </label>
                      <p className="text-foreground font-medium">
                        {data.firstName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Last Name
                      </label>
                      <p className="text-foreground font-medium">
                        {data.lastName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Known As
                      </label>
                      <p className="text-foreground">{data.knownAs}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Date of Joining
                      </label>
                      <p className="text-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(data.dateOfJoining).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Job Confirmation
                      </label>
                      <div className="flex items-center">
                        {data.jobConfirmation ? (
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                        )}
                        <p className="text-foreground capitalize">
                          {data.jobConfirmation ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Role
                      </label>
                      <p className="text-foreground">{data.role}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Designation
                      </label>
                      <p className="text-foreground font-medium">
                        {data.designation}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Stream
                      </label>
                      <p className="text-foreground">{data.stream}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Sub Stream
                      </label>
                      <p className="text-foreground">{data.subStream}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Base Location
                      </label>
                      <p className="text-foreground flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        {data.baseLocation}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Current Location
                      </label>
                      <p className="text-foreground flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        {data.currentLocation}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Unit
                      </label>
                      <p className="text-foreground">{data.unit}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Unit Head
                      </label>
                      <p className="text-foreground">{data.unitHead}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Confirmation Details Tab */}
        <TabsContent value="confirmation" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirmation Details
                </CardTitle>
                <CardDescription>
                  Job confirmation status and details (if confirmed)
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="confirmationStatus">Status</Label>
                    <Select
                      value={data.confirmationDetails?.status || "pending"}
                      onValueChange={(value) =>
                        onChange?.("confirmationDetails", {
                          ...data.confirmationDetails,
                          status: value,
                        })
                      }
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmationDate">Confirmation Date</Label>
                    <Input
                      id="confirmationDate"
                      type="date"
                      value={data.confirmationDetails?.confirmationDate || ""}
                      onChange={(e) =>
                        onChange?.("confirmationDetails", {
                          ...data.confirmationDetails,
                          confirmationDate: e.target.value,
                        })
                      }
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmationApproval">Approval</Label>
                    <Input
                      id="confirmationApproval"
                      value={data.confirmationDetails?.approval || ""}
                      onChange={(e) =>
                        onChange?.("confirmationDetails", {
                          ...data.confirmationDetails,
                          approval: e.target.value,
                        })
                      }
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmationRating">Rating</Label>
                    <Input
                      id="confirmationRating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={data.confirmationDetails?.rating || 3}
                      onChange={(e) =>
                        onChange?.("confirmationDetails", {
                          ...data.confirmationDetails,
                          rating: parseFloat(e.target.value) || 0,
                        })
                      }
                      disabled={!canEdit}
                      placeholder="Enter rating (0-5)"
                    />
                  </div>
                </div>
              ) : data.jobConfirmation && data.confirmationDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <Badge variant="default" className="capitalize">
                      {data.confirmationDetails.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Confirmation Date
                    </label>
                    <p className="text-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(
                        data.confirmationDetails.confirmationDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Approval
                    </label>
                    <p className="text-foreground">
                      {data.confirmationDetails.approval}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Rating
                    </label>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                      <p className="text-foreground">
                        {data.confirmationDetails.rating}/5
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Job confirmation pending
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Confirmation details will appear here once confirmed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Documents
                </CardTitle>
                <CardDescription>
                  Employee documents and certificates
                </CardDescription>
              </div>
              {isEditMode && canEdit && (
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {data.documents && data.documents.length > 0 ? (
                <div className="space-y-3">
                  {data.documents.map((doc: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          {isEditMode ? (
                            <div className="space-y-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <Label
                                    htmlFor={`doc-name-${index}`}
                                    className="text-xs"
                                  >
                                    Document Name
                                  </Label>
                                  <Input
                                    id={`doc-name-${index}`}
                                    defaultValue={doc.name}
                                    disabled={!canEdit}
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor={`doc-type-${index}`}
                                    className="text-xs"
                                  >
                                    Document Type
                                  </Label>
                                  <Select value={doc.type} disabled={!canEdit}>
                                    <SelectTrigger className="text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Resume">
                                        Resume
                                      </SelectItem>
                                      <SelectItem value="Offer Letter">
                                        Offer Letter
                                      </SelectItem>
                                      <SelectItem value="Contract">
                                        Contract
                                      </SelectItem>
                                      <SelectItem value="Background Check">
                                        Background Check
                                      </SelectItem>
                                      <SelectItem value="Confirmation Letter">
                                        Confirmation Letter
                                      </SelectItem>
                                      <SelectItem value="ID Proof">
                                        ID Proof
                                      </SelectItem>
                                      <SelectItem value="Address Proof">
                                        Address Proof
                                      </SelectItem>
                                      <SelectItem value="Certificate">
                                        Certificate
                                      </SelectItem>
                                      <SelectItem value="Other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <Label
                                    htmlFor={`doc-upload-date-${index}`}
                                    className="text-xs"
                                  >
                                    Upload Date
                                  </Label>
                                  <Input
                                    id={`doc-upload-date-${index}`}
                                    type="date"
                                    defaultValue={doc.uploadDate}
                                    disabled={!canEdit}
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor={`doc-file-${index}`}
                                    className="text-xs"
                                  >
                                    Upload File
                                  </Label>
                                  <Input
                                    id={`doc-file-${index}`}
                                    type="file"
                                    disabled={!canEdit}
                                    className="text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.type} • {doc.size} • Uploaded{" "}
                                {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Uploaded by:{" "}
                                {doc.uploadedBy === "hr"
                                  ? "HR/Admin"
                                  : doc.uploadedBy}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {isEditMode && canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No documents uploaded yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Documents can be uploaded by employees or HR/Admin
                  </p>
                </div>
              )}

              <Separator />

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Document Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • Document names should not contain special characters
                  </li>
                  <li>• Supported formats: PDF, DOC, DOCX, JPG, PNG</li>
                  <li>• Maximum file size: 10MB per document</li>
                  <li>• HR/Admin can add documents on behalf of employees</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfficialInformation;
