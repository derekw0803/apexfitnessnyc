import { redirect } from 'next/navigation';

// Training detail lives on the home page — redirect there
export default function TrainingPage() {
  redirect('/#training');
}
