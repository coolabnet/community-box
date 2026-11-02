import type { DeviceKey } from '@/types/questionnaire';

// Capacity constants are estimates pending team sign-off (H4 in
// research/plans/m4-applications-layer.md). The RAM figures come from the hardware
// READMEs; reusedPC is an assumption.

export interface HardwareCapacity {
  architecture: 'amd64' | 'arm64';
  ramGbOptions: number[];
  maxRamGb: number;
  confidence: 'documented' | 'estimated';
  // Evidence path relative to the repository root.
  evidence: string;
}

export const hardwareCapacity: Record<DeviceKey, HardwareCapacity> = {
  raspberryPi: {
    architecture: 'arm64',
    ramGbOptions: [1, 2, 4, 8, 16],
    maxRamGb: 16,
    confidence: 'documented',
    evidence: 'research/hardware/raspberry_pi_5/README.md',
  },
  zimaBoard: {
    architecture: 'amd64',
    ramGbOptions: [2, 4, 8],
    maxRamGb: 8,
    confidence: 'documented',
    evidence: 'research/hardware/zimaboard/README.md',
  },
  intelNUC: {
    architecture: 'amd64',
    // RAM is added by the buyer; 64 GB is the 13th-generation maximum in the repo research.
    ramGbOptions: [4, 8, 16, 32, 64],
    maxRamGb: 64,
    confidence: 'documented',
    evidence: 'research/hardware/intel_nuc/README.md',
  },
  reusedPC: {
    architecture: 'amd64',
    ramGbOptions: [4, 8],
    maxRamGb: 8,
    confidence: 'estimated',
    evidence: 'research/hardware/recycled_pc/README.md',
  },
};
