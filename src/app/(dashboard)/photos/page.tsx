"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Trash2, Image, Filter } from "lucide-react";

interface SitePhoto {
  id: string;
  fileUrl: string;
  caption: string | null;
  roomName: string | null;
  photoType: string;
  uploadedBy: string | null;
  takenAt: string;
  jobId: string | null;
}

interface Job {
  id: string;
  quote: { projectName: string | null };
  status: string;
}

const PHOTO_TYPES = ["general", "before", "after", "progress", "damage"] as const;

const typeBadgeColor: Record<string, string> = {
  general: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  before: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  after: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  damage: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default function PhotosPage() {
  const [photos, setPhotos] = useState<SitePhoto[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [filterJob, setFilterJob] = useState("");
  const [filterType, setFilterType] = useState("");

  // Upload form
  const [uploadJobId, setUploadJobId] = useState("");
  const [uploadType, setUploadType] = useState<string>("progress");
  const [uploadCaption, setUploadCaption] = useState("");

  // Lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [filterJob]);

  async function loadData() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterJob) params.set("jobId", filterJob);

    const [photosRes, jobsRes] = await Promise.all([
      fetch(`/api/site-photos?${params}`),
      fetch("/api/jobs"),
    ]);

    const photosData = await photosRes.json();
    const jobsData = await jobsRes.json();

    if (Array.isArray(photosData)) setPhotos(photosData);
    if (Array.isArray(jobsData)) setJobs(jobsData);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadTotal(files.length);
    setUploadCount(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      if (uploadJobId) formData.append("jobId", uploadJobId);
      formData.append("photoType", uploadType);
      if (uploadCaption) formData.append("caption", uploadCaption);

      try {
        const res = await fetch("/api/site-photos", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const photo = await res.json();
          setPhotos((prev) => [photo, ...prev]);
        }
      } catch {
        // continue with next file
      }
      setUploadCount(i + 1);
    }

    setUploading(false);
    setUploadCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function deletePhoto(id: string) {
    await fetch(`/api/site-photos/${id}`, { method: "DELETE" });
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // Group photos by date
  const filteredPhotos = photos.filter((p) => {
    if (filterType && p.photoType !== filterType) return false;
    return true;
  });

  const grouped = filteredPhotos.reduce<Record<string, SitePhoto[]>>((acc, photo) => {
    const day = new Date(photo.takenAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(photo);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Job Photos</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Photos</h1>
        <Button onClick={() => fileInputRef.current?.click()} size="sm" disabled={uploading}>
          <Camera className="mr-1.5 h-4 w-4" />
          {uploading ? `Uploading ${uploadCount}/${uploadTotal}...` : "Upload Photos"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Upload options */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Job</label>
              <select
                value={uploadJobId}
                onChange={(e) => setUploadJobId(e.target.value)}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">No job</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.quote?.projectName || "Untitled"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {PHOTO_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Caption</label>
              <input
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="Optional caption for all photos"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={filterJob}
          onChange={(e) => setFilterJob(e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="">All Jobs</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.quote?.projectName || "Untitled"}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="">All Types</option>
          {PHOTO_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">{filteredPhotos.length} photos</span>
      </div>

      {/* Photo grid grouped by day */}
      {Object.keys(grouped).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Image className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">No photos yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload progress photos from the job site. Select a job first, then tap Upload.
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([day, dayPhotos]) => (
          <div key={day}>
            <h3 className="text-sm font-bold text-muted-foreground mb-3">{day}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {dayPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative border rounded-lg overflow-hidden bg-card cursor-pointer"
                  onClick={() => setLightboxUrl(photo.fileUrl)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={photo.fileUrl}
                      alt={photo.caption || "Site photo"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${typeBadgeColor[photo.photoType] || typeBadgeColor.general}`}>
                        {photo.photoType}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePhoto(photo.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="p-2">
                    {photo.caption && (
                      <p className="text-xs truncate">{photo.caption}</p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {photo.uploadedBy || "Unknown"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(photo.takenAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <img
            src={lightboxUrl}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:text-white/80"
            onClick={() => setLightboxUrl(null)}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
