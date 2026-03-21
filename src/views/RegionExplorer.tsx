"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import PoliticianCard from "@/components/PoliticianCard";
import PoliticianPanel from "@/components/PoliticianPanel";
import type { Politician } from "@/lib/api/contracts";
import { MapPin, ChevronRight } from "lucide-react";
import {
  usePoliticiansQuery,
  useProjectsQuery,
  useRegionsQuery,
} from "@/hooks/queries/useCivicQueries";

const RegionExplorer = () => {
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [ward, setWard] = useState("");
  const [selectedPolitician, setSelectedPolitician] = useState<Politician | null>(null);
  const { data: regions, isLoading: isRegionsLoading } = useRegionsQuery();
  const { data: politicians = [], isLoading: isPoliticiansLoading } = usePoliticiansQuery();
  const { data: projects = [], isLoading: isProjectsLoading } = useProjectsQuery();

  const selectedProvince = regions?.provinces.find((p) => p.name === province);
  const selectedDistrict = selectedProvince?.districts.find((d) => d.name === district);
  const selectedMunicipality = selectedDistrict?.municipalities.find((m) => m.name === municipality);

  const wardProjects = projects.filter((p) => (ward ? p.ward === ward : true));
  const wardPoliticians = politicians.filter((p) => (ward ? p.ward === ward : true));

  const selectClass = "field-line appearance-none";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <div className="flex items-center gap-2 text-accent mb-2">
          <MapPin className="w-5 h-5" />
          <p className="font-semibold text-sm uppercase tracking-wider">Province Explorer</p>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Browse by Province</h1>
        <p className="text-muted-foreground mb-8">Navigate through Nepal's provinces, districts, municipalities, and wards.</p>

        {/* Selectors */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <select className={selectClass} value={province} onChange={(e) => { setProvince(e.target.value); setDistrict(""); setMunicipality(""); setWard(""); }}>
            <option value="">Select Province</option>
            {regions?.provinces.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>

          <select className={selectClass} value={district} onChange={(e) => { setDistrict(e.target.value); setMunicipality(""); setWard(""); }} disabled={!province}>
            <option value="">Select District</option>
            {selectedProvince?.districts.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>

          <select className={selectClass} value={municipality} onChange={(e) => { setMunicipality(e.target.value); setWard(""); }} disabled={!district}>
            <option value="">Select Municipality</option>
            {selectedDistrict?.municipalities.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
          </select>

          <select className={selectClass} value={ward} onChange={(e) => setWard(e.target.value)} disabled={!municipality}>
            <option value="">Select Ward</option>
            {selectedMunicipality?.wards.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        {(isRegionsLoading || isPoliticiansLoading || isProjectsLoading) && (
          <div className="surface-line mb-8 pt-4 text-sm text-muted-foreground">
            Loading province data...
          </div>
        )}

        {/* Breadcrumb */}
        {province && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8 flex-wrap">
            <span className="text-foreground font-medium">{province}</span>
            {district && <><ChevronRight className="w-3 h-3" /><span className="text-foreground font-medium">{district}</span></>}
            {municipality && <><ChevronRight className="w-3 h-3" /><span className="text-foreground font-medium">{municipality}</span></>}
            {ward && <><ChevronRight className="w-3 h-3" /><span className="text-accent font-semibold">{ward}</span></>}
          </div>
        )}

        {/* Ward Overview */}
        {ward && (
          <div className="space-y-10">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="surface-line py-6 text-center">
                <p className="text-3xl font-extrabold text-accent">{wardPoliticians.length}</p>
                <p className="text-sm text-muted-foreground">Politicians</p>
              </div>
              <div className="surface-line py-6 text-center">
                <p className="text-3xl font-extrabold text-foreground">{wardProjects.length}</p>
                <p className="text-sm text-muted-foreground">Projects</p>
              </div>
              <div className="surface-line py-6 text-center">
                <p className="text-3xl font-extrabold text-civic-green">
                  {wardProjects.length > 0 ? Math.round(wardProjects.reduce((a, p) => a + p.progress, 0) / wardProjects.length) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Avg. Completion</p>
              </div>
            </div>

            {wardPoliticians.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Ward Politicians</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wardPoliticians.map((p) => (
                    <PoliticianCard key={p.id} politician={p} onClick={() => setSelectedPolitician(p)} />
                  ))}
                </div>
              </div>
            )}

            {wardProjects.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Ward Projects</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wardProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!ward && (
          <div className="text-center py-20 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Select a province to explore</p>
            <p className="text-sm">Navigate through the dropdowns above to find your ward.</p>
          </div>
        )}
      </div>
      {selectedPolitician && (
        <PoliticianPanel
          politician={selectedPolitician}
          projects={projects}
          onClose={() => setSelectedPolitician(null)}
        />
      )}
    </div>
  );
};

export default RegionExplorer;
