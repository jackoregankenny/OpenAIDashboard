'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  createThemeFromBaseColors,
  generateThemeFromLogo,
} from '@/lib/theme-engine/extractors/logo-extractor';
import type { GeneratedThemeResult } from '@/lib/theme-engine/extractors/logo-extractor';
import type { Theme } from '@/lib/theme-engine/types';
import {
  injectFontFaceStyles,
  type FontFormat,
} from '@/lib/theme-engine/font-face';
import { injectThemeStyles } from '@/lib/theme-engine/theme-to-css';
import {
  THEME_STORAGE_KEY,
  type StoredFontFace,
  type StoredThemePackage,
} from '@/lib/theme-engine/theme-storage';

interface FontPairing {
  label: string;
  heading: string;
  body: string;
}

const STEP_DEFINITIONS = [
  {
    title: 'School Details',
    description: 'Tell us a little about your school to personalise the experience.',
  },
  {
    title: 'Upload Crest',
    description: 'We’ll analyse your crest to generate colours that feel on-brand.',
  },
  {
    title: 'Theme Preview',
    description: 'Review the suggested palette and typography pairing for your site.',
  },
] as const;

const FONT_PAIRINGS: FontPairing[] = [
  {
    label: 'Classic Scholarly',
    heading: '"Playfair Display", "Times New Roman", serif',
    body: '"Source Sans Pro", "Helvetica Neue", sans-serif',
  },
  {
    label: 'Modern Academic',
    heading: '"Poppins", "Segoe UI", sans-serif',
    body: '"Inter", "Segoe UI", sans-serif',
  },
  {
    label: 'Friendly & Approachable',
    heading: '"Nunito", "Segoe UI", sans-serif',
    body: '"Work Sans", "Helvetica Neue", sans-serif',
  },
  {
    label: 'Traditional & Formal',
    heading: '"Merriweather", "Georgia", serif',
    body: '"Lora", "Georgia", serif',
  },
];

const DEFAULT_PRIMARY_COLOR = '#2563eb';
const DEFAULT_SOURCE_REFERENCE = 'manual';

type FontUploadRole = 'heading' | 'body';

interface UploadedFont {
  role: FontUploadRole;
  fileName: string;
  family: string;
  dataUrl: string;
  format?: FontFormat;
  weight: string;
  style: string;
}

type FontSelectionState = Partial<Record<FontUploadRole, UploadedFont>>;

const SUPPORTED_FONT_FORMATS: Record<string, FontFormat> = {
  woff2: 'woff2',
  woff: 'woff',
  ttf: 'truetype',
  otf: 'opentype',
};

function detectFontFormat(fileName: string): FontFormat | undefined {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) return undefined;
  return SUPPORTED_FONT_FORMATS[extension];
}

function deriveFontNameFromFile(fileName: string): string {
  const basename = fileName.replace(/\.[^/.]+$/, '');
  if (!basename) return 'Custom Font';
  const parts = basename
    .split(/[-_\s]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  return parts.length ? parts.join(' ') : 'Custom Font';
}

function toFontFamilyValue(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'CustomFont';
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
    return trimmed;
  }
  if (/\s/.test(trimmed)) {
    return `"${trimmed}"`;
  }
  return trimmed;
}

function pickFontPairing(seedColor: string): FontPairing {
  const clean = seedColor.replace('#', '');
  const numeric = clean
    .split('')
    .map((char) => parseInt(char, 16) || 0)
    .reduce((acc, value) => acc + value, 0);

  return FONT_PAIRINGS[numeric % FONT_PAIRINGS.length];
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Unable to read file')); // Should never happen
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

interface ThemePreview extends Theme {
  fontPairing: FontPairing;
}

interface PaletteOption {
  id: string;
  label: string;
  description: string;
  primary: string;
  secondary?: string;
  info?: string;
}

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [schoolName, setSchoolName] = useState('');
  const [crestFile, setCrestFile] = useState<File | null>(null);
  const [crestDataUrl, setCrestDataUrl] = useState<string | null>(null);
  const [crestPreview, setCrestPreview] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemePreview | null>(null);
  const [extractedColors, setExtractedColors] =
    useState<GeneratedThemeResult['extractedColors'] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paletteOptions, setPaletteOptions] = useState<PaletteOption[]>([]);
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('custom');
  const [customPrimary, setCustomPrimary] = useState<string>(DEFAULT_PRIMARY_COLOR);
  const [selectedFontPairing, setSelectedFontPairing] = useState<FontPairing>(
    FONT_PAIRINGS[0]
  );
  const [customFonts, setCustomFonts] = useState<FontSelectionState>({});

  const customFontsRef = useRef<FontSelectionState>({});
  const baseThemeRef = useRef<Omit<Theme, 'id'> | null>(null);
  const themeIdRef = useRef<string>('');

  // Clean up object URLs when file changes
  useEffect(() => {
    if (!crestFile) {
      setCrestPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(crestFile);
    setCrestPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [crestFile]);

  const isNextDisabled = useMemo(() => {
    if (currentStep === 0) {
      return schoolName.trim().length === 0;
    }

    if (currentStep === 1) {
      return !crestFile || isGenerating;
    }

    return false;
  }, [currentStep, crestFile, isGenerating, schoolName]);

  const buildPaletteOptions = (
    colors: GeneratedThemeResult['extractedColors']
  ): PaletteOption[] => {
    const candidates: PaletteOption[] = [
      {
        id: 'dominant',
        label: 'Crest Dominant',
        description: 'Uses the main colour detected from your crest.',
        primary: colors.primary,
        secondary: colors.secondary,
        info: colors.lightVibrant,
      },
      colors.vibrant && {
        id: 'vibrant',
        label: 'Vibrant Accent',
        description: 'Bright, high-energy palette derived from the crest accent.',
        primary: colors.vibrant,
        secondary: colors.lightVibrant,
        info: colors.lightVibrant,
      },
      colors.darkVibrant && {
        id: 'heritage',
        label: 'Heritage Deep',
        description: 'Rich, deeper tone for a traditional academic feel.',
        primary: colors.darkVibrant,
        secondary: colors.primary,
        info: colors.lightVibrant,
      },
      colors.muted && {
        id: 'muted',
        label: 'Muted Classic',
        description: 'Soft neutral tone inspired by the crest’s muted hues.',
        primary: colors.muted,
        secondary: colors.primary,
        info: colors.lightVibrant,
      },
    ].filter(Boolean) as PaletteOption[];

    const seen = new Set<string>();
    return candidates.filter((option) => {
      const hex = option.primary?.toLowerCase();
      if (!hex || seen.has(hex)) return false;
      seen.add(hex);
      return true;
    });
  };

  const applyFontPairingToTheme = useCallback(
    (
      baseTheme: Omit<Theme, 'id'>,
      pairing: FontPairing,
      fonts: FontSelectionState = customFontsRef.current
    ): ThemePreview => {
      baseThemeRef.current = baseTheme;
      if (!themeIdRef.current) {
        themeIdRef.current = `theme-${Date.now()}`;
      }

      const buildStack = (
        font: UploadedFont | undefined,
        fallback: string
      ): string => {
        if (!font) return fallback;
        const formatted = toFontFamilyValue(font.family);
        return `${formatted}, ${fallback}`;
      };

      const headingStack = `var(--font-heading, ${buildStack(fonts.heading, pairing.heading)})`;
      const bodyStack = `var(--font-body, ${buildStack(fonts.body, pairing.body)})`;

      const customPairingActive = Boolean(fonts.heading || fonts.body);

      return {
        ...baseTheme,
        id: themeIdRef.current,
        typography: {
          ...baseTheme.typography,
          fontFamilies: {
            ...baseTheme.typography.fontFamilies,
            heading: headingStack,
            body: bodyStack,
          },
        },
        fontPairing: customPairingActive
          ? {
              label: 'Custom upload',
              heading: headingStack,
              body: bodyStack,
            }
          : pairing,
      };
    },
    []
  );

  const refreshFontFaces = useCallback(() => {
    const fonts = Object.values(customFontsRef.current).filter(Boolean) as UploadedFont[];
    const definitions = fonts.map((font) => ({
      id: `onboarding-${font.role}`,
      family: font.family,
      dataUrl: font.dataUrl,
      format: font.format,
      weight: font.weight,
      style: font.style,
    }));
    injectFontFaceStyles(definitions, 'onboarding-fonts');
  }, []);

  const ensureBaseTheme = useCallback((): Omit<Theme, 'id'> | null => {
    if (baseThemeRef.current) return baseThemeRef.current;
    if (!theme) return null;
    const { fontPairing: _fontPairing, id: _id, ...rest } = theme;
    const fallbackBase = rest as Omit<Theme, 'id'>;
    baseThemeRef.current = fallbackBase;
    return fallbackBase;
  }, [theme]);

  useEffect(() => {
    if (theme) return;
    const baseTheme = createThemeFromBaseColors({
      schoolName: schoolName || 'Your School',
      sourceReference: crestDataUrl ?? DEFAULT_SOURCE_REFERENCE,
      primaryColor: customPrimary || DEFAULT_PRIMARY_COLOR,
    });
    const applied = applyFontPairingToTheme(
      baseTheme,
      selectedFontPairing || FONT_PAIRINGS[0]
    );
    setTheme(applied);
  }, [
    theme,
    schoolName,
    crestDataUrl,
    customPrimary,
    selectedFontPairing,
    applyFontPairingToTheme,
  ]);

  const applyPalette = (
    primaryColor: string,
    paletteMeta?: Pick<PaletteOption, 'secondary' | 'info'>,
    options?: {
      sourceReference?: string;
      crestColors?: GeneratedThemeResult['extractedColors'];
    }
  ) => {
    const name = schoolName || 'Your School';
    const sourceRef =
      options?.sourceReference ?? crestDataUrl ?? DEFAULT_SOURCE_REFERENCE;

    const crestColorsRef = options?.crestColors ?? extractedColors;

    const baseTheme = createThemeFromBaseColors({
      schoolName: name,
      sourceReference: sourceRef,
      primaryColor,
      secondaryColor: paletteMeta?.secondary,
      infoColor:
        paletteMeta?.info ||
        crestColorsRef?.lightVibrant ||
        paletteMeta?.secondary ||
        undefined,
    });

    setTheme(applyFontPairingToTheme(baseTheme, selectedFontPairing));
  };

  const handleGenerateTheme = async () => {
    if (!crestFile || !schoolName) {
      setError('Please provide both a school name and crest.');
      return;
    }

    themeIdRef.current = '';
    baseThemeRef.current = null;
    customFontsRef.current = {};
    setCustomFonts({});
    injectFontFaceStyles([], 'onboarding-fonts');

    setIsGenerating(true);
    setError(null);

    try {
      const dataUrl = await fileToDataUrl(crestFile);
      setCrestDataUrl(dataUrl);

      const { theme: generatedTheme, extractedColors } =
        await generateThemeFromLogo(dataUrl, schoolName);

      setExtractedColors(extractedColors);

      const options = buildPaletteOptions(extractedColors);
      const initialFallback = {
        id: 'dominant',
        label: 'Crest Dominant',
        description: 'Uses the main colour detected from your crest.',
        primary: extractedColors.primary,
        secondary: extractedColors.secondary,
        info: extractedColors.lightVibrant,
      } satisfies PaletteOption;

      const paletteList = options.length > 0 ? options : [initialFallback];

      setPaletteOptions(paletteList);
      setSelectedPaletteId('custom');

      if (!theme) {
        const fallbackTheme = applyFontPairingToTheme(generatedTheme, selectedFontPairing);
        setTheme(fallbackTheme);
      }

      setCurrentStep(2);
    } catch (err) {
      console.error(err);
      setError('We ran into an issue analysing the crest. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPalette = (paletteId: string) => {
    if (!extractedColors) return;
    const option = paletteOptions.find((item) => item.id === paletteId);
    if (!option) return;

    setSelectedPaletteId(paletteId);
    setCustomPrimary(option.primary);
    applyPalette(option.primary, option);
  };

  const handleCustomPrimaryChange = (value: string) => {
    const formatted = value.startsWith('#') ? value : `#${value}`;
    setCustomPrimary(formatted);
    if (/^#([0-9a-fA-F]{6})$/.test(formatted)) {
      setSelectedPaletteId('custom');
      applyPalette(formatted, {
        secondary: extractedColors?.secondary,
        info: extractedColors?.lightVibrant,
      });
    }
  };

  const handleSelectFontPairing = (pairing: FontPairing) => {
    setSelectedFontPairing(pairing);
    const base = ensureBaseTheme();
    if (!base) return;
    const updated = applyFontPairingToTheme(base, pairing);
    setTheme(updated);
  };

  const getActivePairing = () => selectedFontPairing;

  const handleFontUpload = async (role: FontUploadRole, file: File | null) => {
    if (!file) return;

    const format = detectFontFormat(file.name);
    if (!format) {
      setError('Unsupported font format. Please upload WOFF, WOFF2, TTF, or OTF files.');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      const uploadedFont: UploadedFont = {
        role,
        fileName: file.name,
        family: deriveFontNameFromFile(file.name),
        dataUrl,
        format,
        weight: '400',
        style: 'normal',
      };

      customFontsRef.current = {
        ...customFontsRef.current,
        [role]: uploadedFont,
      };
      setCustomFonts((prev) => ({ ...prev, [role]: uploadedFont }));
      refreshFontFaces();

      const base = ensureBaseTheme();
      const pairing = getActivePairing();
      if (base && pairing) {
        const updated = applyFontPairingToTheme(base, pairing, customFontsRef.current);
        setTheme(updated);
      }

      setError(null);
    } catch (err) {
      console.error(err);
      setError("We couldn't read that font file. Please try a different one.");
    }
  };

  const handleFontRemove = (role: FontUploadRole) => {
    if (!customFontsRef.current[role]) return;

    customFontsRef.current = {
      ...customFontsRef.current,
      [role]: undefined,
    };
    setCustomFonts((prev) => ({ ...prev, [role]: undefined }));
    refreshFontFaces();

    const base = ensureBaseTheme();
    const pairing = getActivePairing();
    if (base && pairing) {
      const updated = applyFontPairingToTheme(base, pairing, customFontsRef.current);
      setTheme(updated);
    }
  };

  const handleFontNameChange = (role: FontUploadRole, name: string) => {
    const current = customFontsRef.current[role];
    if (!current) return;

    const updatedFont: UploadedFont = {
      ...current,
      family: name,
    };

    customFontsRef.current = {
      ...customFontsRef.current,
      [role]: updatedFont,
    };
    setCustomFonts((prev) => ({ ...prev, [role]: updatedFont }));
    refreshFontFaces();

    const base = ensureBaseTheme();
    const pairing = getActivePairing();
    if (base && pairing) {
      const updated = applyFontPairingToTheme(base, pairing, customFontsRef.current);
      setTheme(updated);
    }
  };

  useEffect(() => {
    refreshFontFaces();
    if (theme) {
      injectThemeStyles(theme);
    }
  }, [customFonts, refreshFontFaces, theme]);

  useEffect(() => {
    if (!theme) return;
    const nextName = `${schoolName || 'Your School'} Theme`;
    if (theme.name === nextName) return;

    setTheme((prev) => (prev ? { ...prev, name: nextName } : prev));
    if (baseThemeRef.current) {
      baseThemeRef.current = {
        ...baseThemeRef.current,
        name: nextName,
      };
    }
  }, [schoolName, theme]);

  const mapFontToStored = (font: UploadedFont): StoredFontFace => ({
    family: font.family.trim() || 'CustomFont',
    dataUrl: font.dataUrl,
    format: font.format,
    weight: font.weight,
    style: font.style,
  });

  const handleFinish = () => {
    if (!theme) return;

    const { fontPairing, ...rest } = theme;
    const storedTheme = { ...rest } as Theme;
    const themeForStorage: Theme = {
      ...storedTheme,
      metadata: storedTheme.metadata
        ? {
            ...storedTheme.metadata,
            updatedAt: new Date().toISOString(),
          }
        : undefined,
    };

    const fontsPayload = customFontsRef.current;
    const storedFonts: StoredThemePackage['customFonts'] = {};
    if (fontsPayload.heading) {
      storedFonts.heading = mapFontToStored(fontsPayload.heading);
    }
    if (fontsPayload.body) {
      storedFonts.body = mapFontToStored(fontsPayload.body);
    }

    const payload: StoredThemePackage = {
      theme: themeForStorage,
      fontPairing: fontPairing
        ? {
            label: fontPairing.label,
            heading: fontPairing.heading,
            body: fontPairing.body,
          }
        : undefined,
      customFonts:
        storedFonts.heading || storedFonts.body ? storedFonts : undefined,
      metadata: {
        generatedAt: new Date().toISOString(),
        schoolName: schoolName || undefined,
      },
    };

    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Failed to persist theme', err);
    }

    router.push('/editor/demo');
  };

  const handleNext = () => {
    if (currentStep === 1) {
      void handleGenerateTheme();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEP_DEFINITIONS.length - 1));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="uppercase tracking-[0.4em] text-sm text-slate-300">
            Welcome to the builder
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold mt-4 mb-3">
            Let’s set up your school brand
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Follow a few quick steps so we can tailor the design system to your
            school’s identity. You can fine-tune everything later.
          </p>
        </div>

        <StepHeader currentStep={currentStep} />

        <div className="bg-white text-slate-900 rounded-3xl shadow-xl p-8 md:p-10 mt-8">
          {currentStep === 0 && (
            <StepSchoolDetails
              schoolName={schoolName}
              onChange={setSchoolName}
            />
          )}

          {currentStep === 1 && (
            <StepCrestUpload
              crestPreview={crestPreview}
              isGenerating={isGenerating}
              onFileSelect={(file) => {
                setTheme(null);
                setCrestFile(file);
              }}
              schoolName={schoolName}
            />
          )}

          {currentStep === 2 && theme && (
            <StepThemePreview
              crestPreview={crestPreview}
              schoolName={schoolName}
              theme={theme}
              paletteOptions={paletteOptions}
              selectedPaletteId={selectedPaletteId}
              onSelectPalette={handleSelectPalette}
              customPrimary={customPrimary}
              onCustomPrimaryChange={handleCustomPrimaryChange}
              selectedFontPairing={selectedFontPairing}
              onSelectFontPairing={handleSelectFontPairing}
              fontPairings={FONT_PAIRINGS}
              customFonts={customFonts}
              onFontUpload={handleFontUpload}
              onFontRemove={handleFontRemove}
              onFontNameChange={handleFontNameChange}
            />
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-slate-500">
              Step {currentStep + 1} of {STEP_DEFINITIONS.length}
            </div>

            <div className="flex gap-3 justify-end">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                  disabled={isGenerating}
                >
                  Back
                </button>
              )}

              {currentStep < STEP_DEFINITIONS.length - 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === 1 ? (
                    isGenerating ? 'Generating…' : 'Generate Theme'
                  ) : (
                    'Next'
                  )}
                </button>
              )}

              {currentStep === STEP_DEFINITIONS.length - 1 && theme && (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition"
                >
                  Jump into the editor
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-slate-400">
        {STEP_DEFINITIONS.map((step, index) => (
          <div key={step.title} className="flex-1 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-transform ${
                index === currentStep
                  ? 'bg-blue-500 border-blue-400 text-white scale-105'
                  : index < currentStep
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'border-slate-700 text-slate-400'
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-2 font-medium text-xs uppercase tracking-wide">
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center text-slate-300">
        <h2 className="text-xl font-semibold text-white mb-2">
          {STEP_DEFINITIONS[currentStep].title}
        </h2>
        <p>{STEP_DEFINITIONS[currentStep].description}</p>
      </div>
    </div>
  );
}

function StepSchoolDetails({
  schoolName,
  onChange,
}: {
  schoolName: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">School basics</h3>
        <p className="text-slate-500 mt-2">
          We’ll use this name everywhere in your site and brand deliverables.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-2">
            School name
          </span>
          <input
            type="text"
            value={schoolName}
            onChange={(event) => onChange(event.target.value)}
            placeholder="e.g. Horizon Academy"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
        </label>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-700 mb-1">Why we ask</p>
          <p>
            The name helps us include your branding in headers, metadata and generated assets so everything feels cohesive from the start.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepCrestUpload({
  crestPreview,
  isGenerating,
  onFileSelect,
  schoolName,
}: {
  crestPreview: string | null;
  isGenerating: boolean;
  onFileSelect: (file: File | null) => void;
  schoolName: string;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Upload your crest</h3>
        <p className="text-slate-500 mt-2">
          Supported formats: PNG, JPG or SVG. For best results, use a file with a transparent background.
        </p>
      </div>

      <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 rounded-2xl py-12 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition bg-slate-50">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            onFileSelect(file ?? null);
          }}
          disabled={isGenerating}
        />
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
          🛡️
        </div>
        <div className="text-center">
          <p className="font-medium text-slate-700">
            {crestPreview ? 'Replace crest' : 'Upload crest image'}
          </p>
          <p className="text-sm text-slate-500">
            {crestPreview
              ? 'Looks great! You can swap it before generating if needed.'
              : 'Drag & drop or click to browse'}
          </p>
        </div>
      </label>

      {crestPreview && (
        <div className="flex items-start gap-6">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 bg-white">
            <Image
              src={crestPreview}
              alt={`${schoolName || 'School'} crest preview`}
              fill
              className="object-contain p-4"
              unoptimized
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 mb-2">Preview</h4>
            <p className="text-sm text-slate-500">
              Once you continue, we’ll analyse this image to pull out the dominant colours and craft a matching palette.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StepThemePreview({
  crestPreview,
  schoolName,
  theme,
  paletteOptions,
  selectedPaletteId,
  onSelectPalette,
  customPrimary,
  onCustomPrimaryChange,
  selectedFontPairing,
  onSelectFontPairing,
  fontPairings,
  customFonts,
  onFontUpload,
  onFontRemove,
  onFontNameChange,
}: {
  crestPreview: string | null;
  schoolName: string;
  theme: ThemePreview;
  paletteOptions: PaletteOption[];
  selectedPaletteId: string;
  onSelectPalette: (paletteId: string) => void;
  customPrimary: string;
  onCustomPrimaryChange: (hex: string) => void;
  selectedFontPairing: FontPairing;
  onSelectFontPairing: (pairing: FontPairing) => void;
  fontPairings: FontPairing[];
  customFonts: FontSelectionState;
  onFontUpload: (role: FontUploadRole, file: File | null) => void;
  onFontRemove: (role: FontUploadRole) => void;
  onFontNameChange: (role: FontUploadRole, name: string) => void;
}) {
  const primaryShades = useMemo(
    () => ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    []
  );

  const currentPrimary = theme.colors.primary[500] || theme.colors.primary.DEFAULT;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">
            {schoolName || 'Your school'} brand kit
          </h3>
          <p className="text-slate-500 mt-2">
            Here’s what we generated. You can tweak colours and typography later in settings.
          </p>
        </div>

        {crestPreview && (
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            <Image
              src={crestPreview}
              alt={`${schoolName || 'School'} crest preview`}
              fill
              className="object-contain p-4"
              unoptimized
            />
          </div>
        )}
      </div>

      <section>
        {paletteOptions.length > 0 && (
          <>
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Palette presets</h4>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {paletteOptions.map((option) => {
                const isSelected = option.id === selectedPaletteId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelectPalette(option.id)}
                    className={`text-left rounded-2xl border p-4 transition shadow-sm hover:shadow-md ${
                      isSelected
                        ? 'border-blue-500 shadow-blue-200/60 bg-blue-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="inline-block w-10 h-10 rounded-xl border border-black/10"
                        style={{ backgroundColor: option.primary }}
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{option.label}</p>
                        <p className="text-xs text-slate-500">{option.description}</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      Primary: <span className="font-medium text-slate-700">{option.primary}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 p-4 bg-slate-50">
          <div>
            <p className="text-sm font-semibold text-slate-700">Custom primary colour</p>
            <p className="text-xs text-slate-500">
              Choose any colour to instantly rebuild the palette.
            </p>
            {selectedPaletteId === 'custom' &&
              customPrimary.toLowerCase() !== DEFAULT_PRIMARY_COLOR.toLowerCase() && (
              <p className="inline-flex items-center gap-2 text-xs text-emerald-600 mt-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                Custom colour in use
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={/^#([0-9a-fA-F]{6})$/.test(customPrimary)
                ? customPrimary
                : currentPrimary}
              onChange={(event) => onCustomPrimaryChange(event.target.value)}
              className="h-10 w-14 rounded border border-slate-300"
            />
            <input
              type="text"
              value={customPrimary}
              onChange={(event) => onCustomPrimaryChange(event.target.value)}
              placeholder="#123ABC"
              className="w-28 px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>
        </div>
      </section>

      <section>
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Primary palette</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {primaryShades.map((shade) => {
            const value = theme.colors.primary[shade as keyof typeof theme.colors.primary];
            if (!value) return null;

            return (
              <div
                key={shade}
                className="rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div
                  className="h-20"
                  style={{ backgroundColor: value }}
                />
                <div className="px-3 py-2 text-sm font-medium flex items-center justify-between">
                  <span>{shade}</span>
                  <span className="text-xs text-slate-400">{value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
          <h4 className="text-lg font-semibold text-slate-800 mb-3">Typography</h4>
          <p className="text-sm text-slate-500 mb-6">
            Suggested pairing: <span className="font-medium text-slate-700">{theme.fontPairing.label}</span>
          </p>
          <div className="space-y-3 mb-6">
            {fontPairings.map((pairing) => {
              const isSelected = pairing.label === selectedFontPairing.label;
              return (
                <button
                  key={pairing.label}
                  type="button"
                  onClick={() => onSelectFontPairing(pairing)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <p className="font-medium text-slate-800">{pairing.label}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Heading: {pairing.heading.split(',')[0]} · Body: {pairing.body.split(',')[0]}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase text-slate-500 mb-1">Heading</p>
              <p
                className="text-3xl"
                style={{ fontFamily: theme.typography.fontFamilies.heading }}
              >
                {schoolName || 'Sample Heading'}
              </p>
              <p className="text-xs text-slate-400">
                {theme.typography.fontFamilies.heading}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-500 mb-1">Body</p>
              <p
                className="text-base leading-relaxed"
                style={{ fontFamily: theme.typography.fontFamilies.body }}
              >
                Empowering students to reach their full potential through engaging experiences and a supportive community.
              </p>
              <p className="text-xs text-slate-400">
                {theme.typography.fontFamilies.body}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
          <h4 className="text-lg font-semibold text-slate-800 mb-3">Theme summary</h4>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>
              <span className="font-medium text-slate-700">Primary colour:</span>{' '}
              {theme.colors.primary[500]}
            </li>
            {theme.colors.secondary && theme.colors.secondary[500] && (
              <li>
                <span className="font-medium text-slate-700">Secondary colour:</span>{' '}
                {theme.colors.secondary[500]}
              </li>
            )}
            <li>
              <span className="font-medium text-slate-700">Neutral base:</span>{' '}
              {theme.colors.neutral[500]}
            </li>
            <li>
              <span className="font-medium text-slate-700">Source:</span>{' '}
              Crest analysis
            </li>
          </ul>
          <div className="mt-6 text-xs text-slate-500">
            Need adjustments? You can revisit these settings anytime from the theme panel in the editor.
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-6 bg-slate-50 space-y-5">
        <div>
          <h4 className="text-lg font-semibold text-slate-800">Custom fonts</h4>
          <p className="text-sm text-slate-500 mt-1">
            Upload your brand fonts to use across headings and body text. We keep system fallbacks in place so your typography stays reliable.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FontUploadCard
            label="Heading font"
            description="Used for titles, hero copy, and key accents."
            role="heading"
            font={customFonts.heading}
            sampleStack={theme.typography.fontFamilies.heading}
            onUpload={onFontUpload}
            onRemove={onFontRemove}
            onNameChange={onFontNameChange}
          />
          <FontUploadCard
            label="Body font"
            description="Used for paragraph text, buttons, and UI labels."
            role="body"
            font={customFonts.body}
            sampleStack={theme.typography.fontFamilies.body}
            onUpload={onFontUpload}
            onRemove={onFontRemove}
            onNameChange={onFontNameChange}
          />
        </div>

        <p className="text-xs text-slate-400">
          Tip: Provide WOFF2 files when possible. They&apos;re lightweight and render crisply across browsers.
        </p>
      </section>
    </div>
  );
}

interface FontUploadCardProps {
  label: string;
  description: string;
  role: FontUploadRole;
  font?: UploadedFont;
  sampleStack: string;
  onUpload: (role: FontUploadRole, file: File | null) => void;
  onRemove: (role: FontUploadRole) => void;
  onNameChange: (role: FontUploadRole, name: string) => void;
}

function FontUploadCard({
  label,
  description,
  role,
  font,
  sampleStack,
  onUpload,
  onRemove,
  onNameChange,
}: FontUploadCardProps) {
  const inputId = `font-upload-${role}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-800">{label}</p>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
        {font && (
          <button
            type="button"
            onClick={() => onRemove(role)}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      <label
        htmlFor={inputId}
        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-6 text-center text-sm text-slate-600 hover:border-blue-400 hover:bg-blue-50/50 transition cursor-pointer"
      >
        <input
          id={inputId}
          type="file"
          accept=".woff,.woff2,.ttf,.otf"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            onUpload(role, file);
            event.target.value = '';
          }}
        />
        <span className="text-xl">🅰️</span>
        <span className="font-medium text-slate-700">
          {font ? 'Replace font file' : 'Upload font file'}
        </span>
        <span className="text-xs text-slate-500">WOFF2, WOFF, TTF or OTF</span>
      </label>

      {font && (
        <>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Font family name
            </label>
            <input
              value={font.family}
              onChange={(event) => onNameChange(role, event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Horizon Display"
            />
          </div>

          <div
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-sm leading-relaxed"
            style={{ fontFamily: sampleStack }}
          >
            The quick brown fox jumps over the lazy dog.
          </div>

          <p className="text-xs text-slate-500">
            {font.fileName} · {font.format?.toUpperCase() || 'auto'} · weight {font.weight}
          </p>
        </>
      )}
    </div>
  );
}
