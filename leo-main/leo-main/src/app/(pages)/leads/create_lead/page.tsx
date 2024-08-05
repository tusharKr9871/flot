import CreateLeadForm from '@/components/create-lead-form';
import { Card } from '@tremor/react';

const CreateLead = () => {
  return (
    <div className="md:mx-24 mt-8">
      <Card>
        <CreateLeadForm />
      </Card>
    </div>
  );
};

export default CreateLead;
