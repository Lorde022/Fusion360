/* Single source of truth for the course structure.
   Both the index page and the lesson navigation read from this file. */
window.CURRICULUM = {
  modules: [
    {
      id: "1-grundlagen",
      number: 1,
      title: "Fusion Grundlagen",
      description: "Vom ersten Klick bis zum ersten 3D-Körper. Interface, Sketches, Extrude.",
      lessons: [
        { id: "1-was-ist-cad",        title: "Was ist parametrisches CAD? Installation & Lizenz",       minutes: 35 },
        { id: "2-interface",          title: "Interface, Navigation, ViewCube, Browser, Timeline",      minutes: 40 },
        { id: "3-sketching-basics",   title: "Sketching I: Linien, Kreise, Rechtecke, Constraints",     minutes: 45 },
        { id: "4-extrude-revolve",    title: "Vom 2D zum 3D: Extrude, Revolve, Press-Pull",             minutes: 45 },
        { id: "5-mini-projekt-wuerfel", title: "Mini-Projekt: parametrischer Aufbewahrungswürfel",      minutes: 60 }
      ]
    },
    {
      id: "2-parametrik",
      number: 2,
      title: "Parametrisches Konstruieren",
      description: "Constraints, User-Parameter, Konstruktionsebenen, Patterns.",
      lessons: [
        { id: "1-constraints",         title: "Sketch-Constraints sicher anwenden",                     minutes: 45 },
        { id: "2-user-parameter",      title: "User-Parameter und Variablen",                           minutes: 40 },
        { id: "3-konstruktionsebenen", title: "Konstruktionsebenen, -achsen, -punkte",                  minutes: 40 },
        { id: "4-patterns",            title: "Patterns: rechteckig, kreisförmig, Spiegeln, Pfad",      minutes: 40 },
        { id: "5-projekt-kabelhalter", title: "Übungsprojekt: parametrische Kabelhalterung",            minutes: 60 }
      ]
    },
    {
      id: "3-3d-druck",
      number: 3,
      title: "Design für den 3D-Druck",
      description: "FDM-gerecht konstruieren: Wandstärken, Toleranzen, Verbindungen, Export.",
      lessons: [
        { id: "1-druckbarkeit",       title: "Druckbarkeit: Wandstärken, Überhänge, Druckorientierung",  minutes: 45 },
        { id: "2-toleranzen",         title: "FDM-Toleranzen verstehen (Press-fit, Clearance, Loose)",   minutes: 50 },
        { id: "3-schraubsitze",       title: "Schraub- und Muttersitze, Heat-set Inserts",               minutes: 45 },
        { id: "4-snap-fits",          title: "Snap-Fit-Verbindungen: Geometrie und Auslegung",           minutes: 50 },
        { id: "5-export-stl",         title: "Export: STL, 3MF, Mesh-Workspace, Reparatur",              minutes: 35 },
        { id: "6-projekt-wandhalter", title: "Projekt: funktionale Wandhalterung mit Snap-Fit",          minutes: 60 }
      ]
    },
    {
      id: "4-holzwerken",
      number: 4,
      title: "Design für Holzwerken",
      description: "Holzverbindungen, Plattenwerkstoffe, Werkstattzeichnungen, CNC/Laser-Export.",
      lessons: [
        { id: "1-materialien",        title: "Holz in Fusion: Materialien und realistisches Aussehen",   minutes: 30 },
        { id: "2-holzverbindungen",   title: "Holzverbindungen: Zapfen, Zinken, Schwalbenschwanz",      minutes: 60 },
        { id: "3-plattenwerkstoffe",  title: "Plattenwerkstoffe und reale Materialdicken",              minutes: 35 },
        { id: "4-drawings",           title: "Drawings: Werkstattzeichnungen mit Schnitten und Maßen",  minutes: 50 },
        { id: "5-stuecklisten",       title: "Stücklisten (BOM) und Beschriftung",                       minutes: 35 },
        { id: "6-cnc-laser-export",   title: "Export für CNC und Lasercutter (DXF, Manufacture)",       minutes: 50 },
        { id: "7-projekt-wandregal",  title: "Projekt: Wandregal mit Werkstattzeichnung",               minutes: 60 }
      ]
    },
    {
      id: "5-baugruppen",
      number: 5,
      title: "Baugruppen",
      description: "Komponenten, Joints, Top-Down vs. Bottom-Up Konstruktion.",
      lessons: [
        { id: "1-komponenten-bodies", title: "Komponenten vs. Bodies",                                   minutes: 35 },
        { id: "2-joints",             title: "Joints und Bewegungen",                                    minutes: 45 },
        { id: "3-top-down",           title: "Top-Down vs. Bottom-Up Konstruktion",                      minutes: 40 }
      ]
    },
    {
      id: "6-abschlussprojekt",
      number: 6,
      title: "Abschlussprojekt: Hybrid Holz + 3D-Druck",
      description: "Tischlampe mit Holzfuß und gedruckter Fassungshalterung.",
      lessons: [
        { id: "1-konzept",     title: "Konzept und parametrisches Skelett",   minutes: 45 },
        { id: "2-detaillierung", title: "Detaillierung beider Bauteilarten, Toleranzcheck", minutes: 60 },
        { id: "3-finalisierung", title: "Werkstattzeichnung, STL-Export, Renderings",       minutes: 50 }
      ]
    }
  ]
};

window.CURRICULUM.flat = window.CURRICULUM.modules.flatMap(m =>
  m.lessons.map((l, i) => ({
    moduleId: m.id,
    moduleNumber: m.number,
    moduleTitle: m.title,
    lessonId: l.id,
    lessonIndex: i + 1,
    title: l.title,
    minutes: l.minutes,
    href: `module/${m.id}/${i + 1}-${l.id}.html`,
    key: `${m.id}/${i + 1}-${l.id}`
  }))
);
