import { RentalTerms } from '@/types/business';

export const rentalTerms: RentalTerms = {
  allowedMaterials: [
    'Household junk, furniture, and clutter',
    'Construction & demolition debris (drywall, wood, framing)',
    'Flooring, carpet, tile, and cabinetry',
    'Roofing shingles and underlayment',
    'Yard waste, brush, branches, and landscaping debris',
  ],
  prohibitedMaterials: [
    'Hazardous waste, chemicals, liquids, and paints',
    'Tires and automotive fluids',
    'Batteries and electronic hazardous waste',
    'Asbestos or biologically hazardous items',
    'Freon/refrigerant units (unless certified drained)',
  ],
  drivewayProtection: 'Careful roll-off placement designed to respect residential driveways and paved work areas.',
  weightLimitGuidelines: 'Keep contents level with the top rim of the dumpster container to ensure safe road transport.',
  rentalRules: [
    'Do not overload above the top sidewall rail',
    'Distribute heavy items evenly across the container bed',
    'Ensure clear vehicle access for delivery and scheduled retrieval',
  ],
};
