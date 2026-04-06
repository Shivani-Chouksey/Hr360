export type HOLIDAY = {
  _id: string | number;
  title: string;
  date: Date;
  year: number;
  month: number;
  type: 'national' | 'regional' | 'optional' | 'company';
  description: string;
  applicableLocations: string[];
  isActive: boolean;
  createdBy: string;
}