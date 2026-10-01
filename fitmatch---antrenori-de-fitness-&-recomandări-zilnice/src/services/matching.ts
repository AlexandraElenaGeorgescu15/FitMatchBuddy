import { Coach, FitnessGoal, CoachingStyle, MatchScoreResult } from '../types';

export function calculateMatchScore(
  coach: Coach,
  criteria: {
    goal: FitnessGoal;
    preferred_style: CoachingStyle;
    budget: number;
    workout_days: number;
  }
): MatchScoreResult {
  const reasons: string[] = [];

  // 1. SPECIALTY COMPATIBILITY (0-100, weight 40%)
  let specialtyScore = 40;
  if (criteria.goal === 'Slăbire') {
    if (coach.specialty === 'Slăbire') {
      specialtyScore = 100;
      reasons.push('Specializare directă pe Slăbire & compoziție corporală');
    } else if (coach.specialty === 'CrossFit') {
      specialtyScore = 75;
      reasons.push('Condiționare metabolică de intensitate mare pentru arderea caloriilor');
    } else if (coach.specialty === 'Hipertrofie') {
      specialtyScore = 60;
    } else {
      specialtyScore = 35;
    }
  } else if (criteria.goal === 'Masă musculară') {
    if (coach.specialty === 'Hipertrofie') {
      specialtyScore = 100;
      reasons.push('Expert în hipertrofie, supraîncărcare progresivă și forță');
    } else if (coach.specialty === 'CrossFit') {
      specialtyScore = 70;
      reasons.push('Dezvoltă masă musculară atletică și forță funcțională');
    } else if (coach.specialty === 'Slăbire') {
      specialtyScore = 55;
    } else {
      specialtyScore = 35;
    }
  } else if (criteria.goal === 'Recuperare') {
    if (coach.specialty === 'Recuperare') {
      specialtyScore = 100;
      reasons.push('Certificat în kinetoterapie, postură și mobilitate');
    } else if (coach.specialty === 'Slăbire') {
      specialtyScore = 40;
    } else {
      specialtyScore = 25;
    }
  } else if (criteria.goal === 'Rezistență') {
    if (coach.specialty === 'CrossFit') {
      specialtyScore = 100;
      reasons.push('Optimizat pentru anduranță cardiovasculară și capacitate de efort');
    } else if (coach.specialty === 'Slăbire') {
      specialtyScore = 80;
      reasons.push('Circuite cardio și antrenamente de anduranță');
    } else if (coach.specialty === 'Recuperare') {
      specialtyScore = 50;
    } else {
      specialtyScore = 45;
    }
  }

  // 2. STYLE COMPATIBILITY (0-100, weight 25%)
  let styleScore = 50;
  if (coach.style === criteria.preferred_style) {
    styleScore = 100;
    reasons.push(`Stilul de comunicare ${coach.style.toLowerCase()} corespunde exact preferinței tale`);
  } else if (
    (criteria.preferred_style === 'Tehnic' && coach.style === 'Strict') ||
    (criteria.preferred_style === 'Strict' && coach.style === 'Tehnic')
  ) {
    styleScore = 75;
    reasons.push(`Abordare disciplinată apropiată de stilul dorit`);
  } else if (
    (criteria.preferred_style === 'Empatic' && coach.style === 'Tehnic') ||
    (criteria.preferred_style === 'Tehnic' && coach.style === 'Empatic')
  ) {
    styleScore = 65;
    reasons.push('Abordare echilibrată între suport și ghidaj tehnic');
  } else {
    styleScore = 40;
  }

  // 3. BUDGET COMPATIBILITY (0-100, weight 25%)
  let budgetScore = 70;
  const rate = coach.monthly_rate_ron || (coach.price_tier === 1 ? 220 : coach.price_tier === 2 ? 380 : 550);
  
  if (criteria.budget >= rate) {
    // Within budget
    const diff = criteria.budget - rate;
    if (diff <= 100) {
      budgetScore = 100;
      reasons.push(`Tarif de ${rate} RON perfect aliniat cu bugetul tău de ${criteria.budget} RON`);
    } else {
      budgetScore = 90;
      reasons.push(`Tarif sub bugetul alocat (${rate} RON vs ${criteria.budget} RON)`);
    }
  } else {
    // Over budget
    const overage = rate - criteria.budget;
    if (overage <= 60) {
      budgetScore = 75;
      reasons.push(`Tarif ușor peste buget (+${overage} RON), dar cu valoare adăugată ridicată`);
    } else if (overage <= 150) {
      budgetScore = 50;
    } else {
      budgetScore = 25;
    }
  }

  // 4. FREQUENCY COMPATIBILITY (0-100, weight 10%)
  let frequencyScore = 80;
  if (criteria.workout_days >= 4 && (coach.specialty === 'Hipertrofie' || coach.specialty === 'CrossFit')) {
    frequencyScore = 100;
    reasons.push(`Ideal pentru frecvența ta de ${criteria.workout_days} zile/săptămână`);
  } else if (criteria.workout_days <= 3 && coach.specialty === 'Recuperare') {
    frequencyScore = 95;
    reasons.push(`Frecvența de ${criteria.workout_days} zile permite refacere optimă`);
  } else {
    frequencyScore = 85;
  }

  // WEIGHTED OVERALL (0 - 100)
  const weighted = (
    specialtyScore * 0.40 +
    styleScore * 0.25 +
    budgetScore * 0.25 +
    frequencyScore * 0.10
  );

  // Round and clamp between 45 and 99
  const overallScore = Math.min(99, Math.max(45, Math.round(weighted)));

  return {
    coach,
    overallScore,
    breakdown: {
      specialtyScore,
      styleScore,
      budgetScore,
      frequencyScore
    },
    reasons: reasons.slice(0, 3)
  };
}

export function getRankedCoaches(
  coaches: Coach[],
  criteria: {
    goal: FitnessGoal;
    preferred_style: CoachingStyle;
    budget: number;
    workout_days: number;
  }
): MatchScoreResult[] {
  const scored = coaches.map(coach => calculateMatchScore(coach, criteria));
  // Sort descending by overallScore, then by rating
  scored.sort((a, b) => {
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }
    return (b.coach.rating || 4.5) - (a.coach.rating || 4.5);
  });
  return scored;
}
