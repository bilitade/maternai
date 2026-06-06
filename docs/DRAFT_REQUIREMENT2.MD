For an AI-powered ANC nutrition tracking system for Ethiopian pregnant women, I would recommend organizing the content into five major modules:

1. Maternal Profile Module

Collect baseline information at registration:

Personal Information
Age
Residence (urban/rural)
Educational status
Occupation
Pregnancy Information
Gestational age (weeks)
ANC visit number
Gravidity and parity
Estimated date of delivery (EDD)
Multiple pregnancy (Yes/No)
Anthropometric Information
Pre-pregnancy weight (if available)
Current weight
Height
BMI
MUAC (Mid-Upper Arm Circumference)
2. Nutritional Assessment Module
A. Weight Gain Monitoring

Based on Ethiopian ANC Guideline:

BMI Category	BMI (kg/m²)	Recommended Total Weight Gain
Underweight	<18.5	12.5–18 kg
Normal	18.5–24.9	11.5–16 kg
Overweight	25–29.9	7–11.5 kg
Obese	≥30	5–9 kg

AI should:

Track monthly weight gain
Compare actual vs expected gain
Generate alerts for:
Insufficient gain
Excessive gain
Normal gain
B. MUAC Monitoring
MUAC	Status
<23 cm	Acute Malnutrition
≥23 cm	Normal

AI Alert:

Red flag when MUAC <23 cm
Recommend referral and nutritional support
C. Dietary Diversity Assessment

Based on Ethiopian ANC guideline.

Ask whether consumed during previous 24 hours:

Grains, roots, tubers
Pulses
Nuts and seeds
Dairy
Meat, poultry, fish
Eggs
Dark green leafy vegetables
Vitamin A rich fruits/vegetables
Other vegetables
Other fruits
Dietary Diversity Score
Food Groups Consumed	Status
<5 groups	Poor
≥5 groups	Adequate

AI Recommendation:

Suggest missing food groups
Promote consumption of ≥5 groups daily
3. Micronutrient Monitoring Module
Iron-Folic Acid Supplementation

Track:

Daily intake
Number of tablets received
Adherence %

Recommended:

Iron = 60 mg/day
Folic Acid = 0.4 mg/day
Duration = 180 days

AI should:

Send reminders
Monitor missed doses
Estimate adherence
Calcium Supplementation

Track:

Started after 14 weeks?
Daily dose

Recommended:

1.5–2 g elemental calcium/day

AI Reminder:

Do not take calcium and iron tablets at the same time.
4. Anemia Screening Module
Hemoglobin Tracking
Hb (g/dL)	Classification
≥11	Normal
9–10.9	Mild Anemia
7–8.9	Moderate Anemia
<7	Severe Anemia

AI Recommendations:

Normal
Continue preventive iron-folate
Mild
Therapeutic iron
Dietary counseling
Moderate
Close follow-up
Therapeutic iron
Severe
Immediate referral
5. Nutrition Counseling & Recommendation Engine

The AI system should automatically generate stage-specific recommendations.

First Trimester (0–13 Weeks)

Focus:

Folic acid
Manage nausea/vomiting
Small frequent meals
Hydration

Recommendations:

Fruits
Vegetables
Beans
Lentils
Eggs
Second Trimester (14–27 Weeks)

Focus:

Additional meal daily
Calcium supplementation
Protein-rich foods

Recommendations:

Meat
Fish
Milk
Eggs
Legumes
Third Trimester (28 Weeks+)

Focus:

Adequate weight gain
Iron adherence
Calcium adherence
Energy-rich foods

Recommendations:

Protein-rich foods
Fruits and vegetables
Dairy products
6. Food Safety Module

AI should ask about risky foods and provide warnings.

Avoid:

Raw meat
Raw eggs
Unpasteurized milk
Mold-ripened soft cheese
Unwashed fruits/vegetables
Excess caffeine
Processed/junk foods
7. Physical Activity Monitoring

Weekly assessment:

Walking
Light exercise
Antenatal exercise

AI Recommendation:

Encourage regular aerobic physical activity unless contraindicated.
8. Risk Alert Dashboard
High-Risk Nutritional Alerts

Trigger when:

BMI <18.5
BMI ≥30
MUAC <23 cm
Hb <11 g/dL
Poor dietary diversity (<5 food groups)
Weight gain below expected
Weight gain above expected
Poor supplement adherence (<80%)
9. AI-Generated Nutrition Score

Create a composite score (0–100) using:

Indicator	Weight
Dietary Diversity	25%
Weight Gain	25%
MUAC	15%
Iron Adherence	15%
Calcium Adherence	10%
Hb Status	10%

Output:

Score	Interpretation
80–100	Excellent
60–79	Good
40–59	Needs Improvement
<40	High Nutritional Risk
Minimum Dataset for the AI System

The essential variables are:

Gestational age
Weight
Height
BMI
MUAC
Hemoglobin
Dietary diversity score
Iron intake adherence
Calcium intake adherence
Additional meal consumption
Physical activity status
Presence of anemia
Presence of acute malnutrition
Food safety practices

This structure aligns closely with the Ethiopian National Antenatal Care Guideline (2022) and would provide a strong foundation for an AI-based maternal nutrition tracking and recommendation platform.