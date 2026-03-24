
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function BranchFormPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryId) {
      navigate(`/intake/step1?niche=${categoryId}&from=dashboard`, { replace: true });
    }
  }, [categoryId, navigate]);

  return null;
}
