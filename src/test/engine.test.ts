import { solveFractionArithmetic, solveLinearEquation, solveQuadraticEquation, solveArithmetic } from '../lib/mathEngine';
import { solvePhysicsProblem } from '../lib/physicsEngine';
import { convertUnits } from '../lib/unitEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('--- RUNNING ILMHUB MATH & PHYSICS ENGINE TESTS ---');

// 1. Arithmetic: 2+3=5
const t1 = solveArithmetic('2+3');
assert(t1 !== null && t1.success && t1.finalAnswerExact === '5', 'Arithmetic: 2+3 = 5');

// 2. Fractions: 3/4 + 5/6 = 19/12
const t2 = solveFractionArithmetic('3/4 + 5/6');
assert(t2 !== null && t2.success && t2.finalAnswerExact === '19/12', 'Fractions: 3/4 + 5/6 = 19/12');

// 3. Linear Equation: 3x + 7 = 25 -> x = 6
const t3 = solveLinearEquation('3x + 7 = 25');
assert(t3 !== null && t3.success && t3.finalAnswerExact === 'x = 6' && t3.verified, 'Linear Equation: 3x + 7 = 25 -> x = 6');

// 4. Quadratic Equation: x^2 - 5x + 6 = 0 -> x = 3, 2
const t4 = solveQuadraticEquation('x^2 - 5x + 6 = 0');
assert(t4 !== null && t4.success && (t4.finalAnswerExact.includes('3') && t4.finalAnswerExact.includes('2')), 'Quadratic: x^2 - 5x + 6 = 0 -> x = 3, 2');

// 5. Physics: m = 5 kg, F = 20 N -> a = 4 m/s²
const t5 = solvePhysicsProblem('5 kg massali jismga 20 N kuch tasir qilmoqda. Tezlanishni toping.');
assert(t5 !== null && t5.success && t5.finalAnswerExact.includes('4 m/s²') && t5.verified, 'Physics Newton: m=5kg, F=20N -> a=4 m/s²');

// 6. Speed unit conversion: 72 km/h -> 20 m/s
const t6 = convertUnits(72, 'km/h', 'm/s');
assert(t6 !== null && Math.abs(t6.result - 20) < 1e-4, 'Speed unit conversion: 72 km/h -> 20 m/s');

// 7. Ohm's Law: U = 12 V, R = 4 Ω -> I = 3 A
const t7 = solvePhysicsProblem('U = 12 V, R = 4 ohm, I = ?');
assert(t7 !== null && t7.success && t7.finalAnswerExact.includes('3 A') && t7.verified, 'Ohm: U=12V, R=4Ω -> I=3 A');

// 8. Kinetic Energy: m = 2 kg, v = 5 m/s -> Ek = 25 J
const t8 = solvePhysicsProblem('m = 2 kg, v = 5 m/s, Ek = ?');
assert(t8 !== null && t8.success && t8.finalAnswerExact.includes('25 J') && t8.verified, 'Kinetic Energy: m=2kg, v=5m/s -> Ek=25 J');

console.log('🎉 ALL ENGINE UNIT TESTS PASSED SUCCESSFULLY!');
