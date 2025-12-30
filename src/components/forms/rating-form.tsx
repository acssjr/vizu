'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RatingSlider } from '@/components/ui/slider';

export interface RatingFormProps {
  onSubmit: (ratings: {
    attraction: number;
    trust: number;
    intelligence: number;
  }) => Promise<void>;
  onSkip?: () => void;
  isLoading?: boolean;
  category: 'PROFESSIONAL' | 'DATING' | 'SOCIAL';
}

const categoryLabels = {
  PROFESSIONAL: {
    attraction: {
      label: 'Atratividade Profissional',
      description: 'Quão atraente essa pessoa parece em contexto de trabalho?',
    },
    trust: {
      label: 'Confiança',
      description: 'Você confiaria essa pessoa para um trabalho importante?',
    },
    intelligence: {
      label: 'Competência',
      description: 'Quão competente essa pessoa aparenta ser?',
    },
  },
  DATING: {
    attraction: {
      label: 'Atração',
      description: 'Quão atraente você acha essa pessoa?',
    },
    trust: {
      label: 'Confiabilidade',
      description: 'Essa pessoa parece confiável para um relacionamento?',
    },
    intelligence: {
      label: 'Inteligência',
      description: 'Quão inteligente essa pessoa parece ser?',
    },
  },
  SOCIAL: {
    attraction: {
      label: 'Carisma',
      description: 'Quão carismática essa pessoa parece?',
    },
    trust: {
      label: 'Amigabilidade',
      description: 'Você gostaria de ter essa pessoa como amigo(a)?',
    },
    intelligence: {
      label: 'Interessante',
      description: 'Quão interessante essa pessoa parece ser?',
    },
  },
};

export function RatingForm({ onSubmit, onSkip, isLoading, category }: RatingFormProps) {
  const [attraction, setAttraction] = useState(5);
  const [trust, setTrust] = useState(5);
  const [intelligence, setIntelligence] = useState(5);

  const labels = categoryLabels[category];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ attraction, trust, intelligence });
    // Reset for next photo
    setAttraction(5);
    setTrust(5);
    setIntelligence(5);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RatingSlider
        label={labels.attraction.label}
        description={labels.attraction.description}
        value={attraction}
        onChange={setAttraction}
      />

      <RatingSlider
        label={labels.trust.label}
        description={labels.trust.description}
        value={trust}
        onChange={setTrust}
      />

      <RatingSlider
        label={labels.intelligence.label}
        description={labels.intelligence.description}
        value={intelligence}
        onChange={setIntelligence}
      />

      <div className="flex gap-3">
        {onSkip && (
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={isLoading}
            className="flex-1"
          >
            Pular
          </Button>
        )}
        <Button type="submit" disabled={isLoading} isLoading={isLoading} className="flex-1">
          Enviar Avaliação
        </Button>
      </div>

      <p className="text-center text-xs text-gray-500">
        Sua avaliação é anônima e ajuda outros usuários a melhorarem suas fotos
      </p>
    </form>
  );
}
