import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SCIENCE_CHAPTERS_METADATA = [
  {
    id: 'science-1',
    num: 1,
    title: 'Chemical Reactions and Equations',
    hindiTitle: 'रासायनिक अभिक्रियाएं एवं समीकरण',
    weight: 3,
    unit: 'Unit I: Chemical Substances — Nature & Behaviour',
    file: 'science-01-chemical-reactions-and-equations.md',
    topics: [
      {
        heading: '1. Chemical Reactions & Balanced Equations',
        content: `A chemical reaction is a process where reactants undergo chemical bond rearrangement to transform into products with completely new chemical identities and physical properties.

Indicators of a chemical reaction include:
• Change in state (e.g., formation of precipitate)
• Change in colour (e.g., rust formation, copper sulfate colour shifts)
• Evolution of a gas (e.g., zinc reacting with dilute H₂SO₄ releasing H₂ gas)
• Change in temperature (exothermic reactions like slaking of lime, endothermic reactions like decomposition of calcium carbonate).

**Law of Conservation of Mass**:
Matter can neither be created nor destroyed in a chemical reaction. Therefore, the total number of atoms of each element on the reactant side must strictly equal the total number of atoms on the product side.

**Balancing by Hit-and-Trial Method**:
Always balance the element with the maximum number of atoms first, followed by hydrogen and oxygen, and never modify the chemical formulas of reactants or products.`
      },
      {
        heading: '2. Major Types of Chemical Reactions',
        content: `**1. Combination Reaction**:
Two or more substances combine to form a single product.
• Burning of Magnesium Ribbon:
  2Mg(s) + O₂(g) → 2MgO(s) [Forms dazzling white powder]
• Slaking of Lime (Highly Exothermic):
  CaO(s) (Quicklime) + H₂O(l) → Ca(OH)₂(aq) (Slaked lime) + Heat

**2. Decomposition Reaction**:
A single reactant breaks down into two or more simpler products.
• Thermal Decomposition of Ferrous Sulphate:
  2FeSO₄(s) [Green crystals] —(Heat)→ Fe₂O₃(s) [Reddish-brown] + SO₂(g) + SO₃(g) [Choking sulfur smell]
• Thermal Decomposition of Lead Nitrate:
  2Pb(NO₃)₂(s) —(Heat)→ 2PbO(s) [Yellow] + 4NO₂(g) [Brown fumes] + O₂(g)
• Electrolytic Decomposition of Water:
  2H₂O(l) —(Electric Current)→ 2H₂(g) + O₂(g) [Volume ratio of H₂ : O₂ = 2 : 1]
• Photolytic Decomposition (Silver halides in photography):
  2AgCl(s) [White] —(Sunlight)→ 2Ag(s) [Grey] + Cl₂(g)

**3. Displacement Reaction**:
A more reactive element displaces a less reactive element from its aqueous salt solution.
• Fe(s) + CuSO₄(aq) [Blue] → FeSO₄(aq) [Pale green] + Cu(s) [Reddish brown deposit]
• Zn(s) + CuSO₄(aq) → ZnSO₄(aq) [Colourless] + Cu(s)

**4. Double Displacement Reaction (Precipitation)**:
Mutual exchange of ions between two aqueous compounds producing an insoluble precipitate.
• Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s) [White precipitate] + 2NaCl(aq)

**5. Redox Reactions (Oxidation & Reduction)**:
• **Oxidation**: Gain of oxygen or loss of hydrogen.
• **Reduction**: Loss of oxygen or gain of hydrogen.
• Example: CuO(s) + H₂(g) —(Heat)→ Cu(s) + H₂O(l)
  Here, CuO is reduced to Cu (Oxidizing Agent: CuO), and H₂ is oxidized to H₂O (Reducing Agent: H₂).`
      },
      {
        heading: '3. Effects of Oxidation in Daily Life: Corrosion and Rancidity',
        content: `**Corrosion**:
The slow eating away of metals when exposed to atmospheric moisture, air (oxygen), and acids over time.
• **Rusting of Iron**: Iron reacts with oxygen and water to form hydrated ferric oxide:
  4Fe + 3O₂ + 2xH₂O → 2Fe₂O₃·xH₂O [Reddish brown flake]
• **Corrosion of Copper**: Forms basic copper carbonate [Green coating]:
  2Cu + CO₂ + O₂ + H₂O → CuCO₃·Cu(OH)₂
• **Corrosion of Silver**: Forms silver sulfide [Black tarnish]:
  2Ag + H₂S → Ag₂S + H₂
• **Prevention Methods**: Painting, greasing, oiling, galvanization (coating with molten Zinc), electroplating, and alloying (e.g., Stainless Steel = Fe + Cr + Ni).

**Rancidity**:
When fats and edible oils are oxidized, their taste and smell deteriorate dramatically.
• **Prevention of Rancidity**:
  1. Adding antioxidants (BHA, BHT).
  2. Flushing food packages with inert Nitrogen gas (N₂) to prevent contact with atmospheric oxygen (e.g., potato chips bags).
  3. Keeping foods in airtight containers or refrigerators at low temperatures.`
      }
    ],
    formulas: [
      { title: 'Rusting of Iron', formula: '4Fe + 3O₂ + 2xH₂O → 2Fe₂O₃·xH₂O', subtext: 'Hydrated Ferric Oxide (Reddish brown)' },
      { title: 'Precipitation Reaction', formula: 'Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ + 2NaCl(aq)', subtext: 'Barium Sulphate white precipitate' },
      { title: 'Redox Equation', formula: 'CuO + H₂ → Cu + H₂O', subtext: 'Simultaneous reduction and oxidation' }
    ]
  },
  {
    id: 'science-2',
    num: 2,
    title: 'Acids, Bases and Salts',
    hindiTitle: 'अम्ल, क्षारक एवं लवण',
    weight: 6,
    unit: 'Unit I: Chemical Substances — Nature & Behaviour',
    file: 'science-02-acids-bases-and-salts.md',
    topics: [
      {
        heading: '1. Acid-Base Concepts, Indicators & Chemical Properties',
        content: `**Acids**: Substances that taste sour, turn blue litmus red, and dissociate to release H⁺(aq) or Hydronium ions (H₃O⁺) in water. (Strong acids: HCl, H₂SO₄, HNO₃; Weak acids: CH₃COOH, Citric acid, Oxalic acid).

**Bases**: Substances that taste bitter, feel soapy/slippery to touch, turn red litmus blue, and produce Hydroxide ions (OH⁻) in water. Water-soluble bases are called **alkalis** (NaOH, KOH, Ca(OH)₂).

**Indicators**:
• **Natural Indicators**: Litmus paper (purple lichen dye; red in acid, blue in base), Turmeric (yellow in acid, reddish-brown in base).
• **Synthetic Indicators**:
  - Phenolphthalein: Colourless in acid / neutral, deep pink in base.
  - Methyl Orange: Red/pink in acid, yellow in base.
• **Olfactory Indicators**: Change their odor in acidic or basic media (Onion extract, Vanilla essence, Clove oil lose smell in basic NaOH).

**Key Chemical Reactions**:
1. **Reaction with Metals**:
   Acid + Metal → Salt + Hydrogen Gas (H₂)
   Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g) [H₂ gas burns with a distinctive 'pop' sound]
   *Base exception*: 2NaOH + Zn → Na₂ZnO₂ (Sodium Zincate) + H₂(g)
2. **Reaction with Metal Carbonates & Hydrogen Carbonates**:
   Metal Carbonate + Acid → Salt + CO₂ + H₂O
   Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂(g)
   NaHCO₃ + HCl → NaCl + H₂O + CO₂(g)
   *Lime water test for CO₂*:
   Ca(OH)₂(aq) + CO₂(g) → CaCO₃(s) [Milky white ppt] + H₂O(l)
   *Excess CO₂*: CaCO₃ + H₂O + CO₂ → Ca(HCO₃)₂ [Soluble, milkiness disappears]
3. **Neutralization Reaction**:
   Acid + Base → Salt + Water + Heat
   HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)`
      },
      {
        heading: '2. The pH Scale & Importance in Everyday Life',
        content: `**pH Scale Definition**:
pH measures hydrogen ion concentration in solution: pH = -log₁₀[H⁺].
• Scale runs from 0 (highly acidic) to 14 (highly basic/alkaline). Neutral point = 7.
• Acidic solutions: pH < 7. Higher [H⁺] concentration implies lower pH.
• Basic solutions: pH > 7. Higher [OH⁻] concentration implies higher pH.

**Everyday Significance of pH**:
1. **Human Body**: Functions optimally in narrow pH window of 7.0 to 7.8.
2. **Acid Rain**: When rainwater pH falls below 5.6, it is called acid rain, which severely harms aquatic flora and fauna.
3. **Digestive System**: The stomach secretes Hydrochloric acid (pH ~1.2) to activate pepsin. Excess acid causes hyperacidity; treated with antacids (mild bases like Magnesium Hydroxide / Milk of Magnesia Mg(OH)₂ or NaHCO₃).
4. **Tooth Decay**: Enamel made of Calcium Hydroxyapatite corrodes when oral pH drops below 5.5 due to bacterial acid production from leftover sugar.
5. **Self-Defense by Animals and Plants**:
   - Honeybee and nettle plant stings inject Methanoic acid (Formic acid), causing severe pain. Relieved by applying mild base like baking soda.
   - Dock plant leaves neutralize nettle stings.`
      },
      {
        heading: '3. Essential Salts of Sodium and Calcium',
        content: `**1. Common Salt (NaCl)**: Raw material for Chlor-Alkali process:
Electrolysis of concentrated brine solution produces Sodium Hydroxide, Chlorine gas at anode, and Hydrogen gas at cathode:
2NaCl(aq) + 2H₂O(l) —(Electricity)→ 2NaOH(aq) + Cl₂(g) + H₂(g)

**2. Bleaching Powder (CaOCl₂)**:
Prepared by reacting chlorine gas with dry slaked lime:
Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O
Uses: Disinfecting drinking water, bleaching cotton and linen in textile mills, oxidizing agent.

**3. Baking Soda (Sodium Hydrogen Carbonate - NaHCO₃)**:
Solvay process reaction:
NaCl + H₂O + CO₂ + NH₃ → NH₄Cl + NaHCO₃
On heating: 2NaHCO₃ —(Heat)→ Na₂CO₃ + H₂O + CO₂
Uses: Ingredient in baking powder (mixed with mild edible tartaric acid to prevent bitter taste of Na₂CO₃), antacid, soda-acid fire extinguishers.

**4. Washing Soda (Na₂CO₃·10H₂O)**:
Prepared by recrystallization of sodium carbonate:
Na₂CO₃ + 10H₂O → Na₂CO₃·10H₂O
Uses: Glass, soap, and paper factories, removing permanent hardness of water.

**5. Plaster of Paris (CaSO₄·½H₂O)**:
Prepared by carefully heating Gypsum at 373 K (100°C):
CaSO₄·2H₂O —(373 K)→ CaSO₄·½H₂O + 1½H₂O
On adding water, it sets into a hard solid mass (Gypsum):
CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O
Uses: Setting fractured bones in plaster casts, making decorative statues, false ceilings, and fire-proofing.`
      }
    ],
    formulas: [
      { title: 'Chlor-Alkali Process', formula: '2NaCl + 2H₂O → 2NaOH + Cl₂↑ + H₂↑', subtext: 'Electrolysis of aqueous brine solution' },
      { title: 'Plaster of Paris Setting', formula: 'CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O', subtext: 'Re-hydration into hard Gypsum' },
      { title: 'Neutralization', formula: 'Acid + Base → Salt + Water + Heat', subtext: 'Exothermic neutralization' }
    ]
  },
  {
    id: 'science-3',
    num: 3,
    title: 'Metals and Non-Metals',
    hindiTitle: 'धातु एवं अधातु',
    weight: 5,
    unit: 'Unit I: Chemical Substances — Nature & Behaviour',
    file: 'science-03-metals-and-non-metals.md',
    topics: [
      {
        heading: '1. Physical & Chemical Properties of Metals and Non-Metals',
        content: `**Physical Properties**:
• **Metals**: Malleable (beaten into thin sheets, Gold and Silver most malleable), Ductile (drawn into thin wires, Gold most ductile), Good conductors of heat and electricity (Silver and Copper best; Lead and Mercury poorest), Lustrous, Hard, High melting point, Sonorous.
  - *Exceptions*: Mercury is a liquid metal at room temperature. Gallium and Caesium melt in the palm of your hand. Sodium, Potassium, and Lithium are so soft they can be sliced with a knife.
• **Non-Metals**: Brittle, Non-ductile, Poor conductors of heat and electricity.
  - *Exceptions*: Carbon allotrope (Graphite) conducts electricity well. Diamond is the hardest naturally occurring substance with very high melting point. Iodine is a lustrous non-metal. Bromine is the only liquid non-metal.

**Chemical Reactions of Metals**:
1. **Reaction with Oxygen**:
   Metals form basic oxides (e.g., 2Mg + O₂ → 2MgO).
   - **Amphoteric Oxides**: Metal oxides that react with both acids and bases to yield salt and water (Al₂O₃, ZnO).
     Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O
     Al₂O₃ + 2NaOH → 2NaAlO₂ (Sodium Aluminate) + H₂O
2. **Reaction with Water**:
   - Sodium & Potassium react violently with cold water releasing explosive H₂:
     2K + 2H₂O → 2KOH + H₂ + Heat (stored under kerosene oil).
   - Calcium reacts gently with cold water; floats due to H₂ bubbles sticking to surface.
   - Magnesium reacts only with hot water.
   - Aluminium, Iron, and Zinc react only with steam:
     3Fe + 4H₂O(g) → Fe₃O₄ + 4H₂
3. **Reaction with Acids**:
   Metal + Dilute Acid → Metal Salt + H₂
   *Exception*: Dilute HNO₃ does not produce H₂ gas because nitric acid is a powerful oxidizing agent that oxidizes H₂ into H₂O and gets reduced itself to nitrogen oxides (NO, NO₂, N₂O). Only Mg and Mn react with very dilute HNO₃ to release H₂.
4. **Reactivity Series (Decreasing Reactivity)**:
   K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au.`
      },
      {
        heading: '2. Ionic Compounds: Formation, Structure & Properties',
        content: `**Formation of Ionic Bonds**:
Formed by the complete transfer of valence electrons from a metal atom to a non-metal atom, attaining stable noble gas electronic configurations.
• **Formation of Sodium Chloride (NaCl)**:
  Na (2,8,1) → Na⁺ (2,8) + e⁻
  Cl (2,8,7) + e⁻ → Cl⁻ (2,8,8)
  Na⁺ + Cl⁻ → NaCl (held by strong electrostatic forces).
• **Formation of Magnesium Chloride (MgCl₂)**:
  Mg (2,8,2) → Mg²⁺ + 2e⁻
  2Cl + 2e⁻ → 2Cl⁻
  Mg²⁺ + 2Cl⁻ → MgCl₂

**Characteristic Properties of Ionic Compounds**:
1. **Physical Nature**: Solid, crystalline, and hard due to strong electrostatic attraction between opposite ions. Brittle under external stress.
2. **Melting and Boiling Points**: Very high melting and boiling points because large amounts of thermal energy are required to break strong inter-ionic bonds.
3. **Solubility**: Highly soluble in polar solvents like water; insoluble in organic non-polar solvents like petrol, kerosene, and ether.
4. **Electrical Conductivity**:
   - In solid state: Insulators (ions held fixed in crystal lattice).
   - In molten state or aqueous solution: Excellent electrical conductors (ions are mobile and carry electrical charge).`
      },
      {
        heading: '3. Metallurgy, Refining & Corrosion Prevention',
        content: `**Extraction of Metals based on Reactivity**:
• **Metals Low in Reactivity Series (Hg, Cu)**:
  Extracted by simple roasting:
  2HgS (Cinnabar) + 3O₂ —(Heat)→ 2HgO + 2SO₂
  2HgO —(Heat)→ 2Hg + O₂
• **Metals in Middle of Series (Fe, Zn, Pb)**:
  - **Roasting**: Heating sulfide ores in excess air below melting point:
    2ZnS + 3O₂ —(Heat)→ 2ZnO + 2SO₂
  - **Calcination**: Heating carbonate ores in limited or no air:
    ZnCO₃ —(Heat)→ ZnO + CO₂
  - **Reduction**: ZnO + C → Zn + CO
  - **Thermite Process**: Reduction of iron oxide using aluminium powder:
    Fe₂O₃ + 2Al → 2Fe(l) + Al₂O₃ + Enormous Heat (molten iron used for repairing railway joints).
• **Metals High in Series (Na, Mg, Al)**:
  Extracted only by electrolytic reduction of their molten chlorides:
  At Cathode: Na⁺ + e⁻ → Na(s); At Anode: 2Cl⁻ → Cl₂(g) + 2e⁻.

**Electrolytic Refining of Copper**:
• Anode: Thick block of impure copper.
• Cathode: Thin strip of pure copper.
• Electrolyte: Acidified copper sulfate solution (CuSO₄ + dilute H₂SO₄).
• On passing electric current, pure Cu deposits on cathode; insoluble impurities settle below anode as **anode mud** (contains precious metals like Ag, Au, Pt).

**Alloying**:
Homogeneous mixture of two or more metals, or a metal and non-metal.
• Brass: Cu (70%) + Zn (30%)
• Bronze: Cu (90%) + Sn (10%)
• Solder: Pb (50%) + Sn (50%) [Low melting point, used for electrical welding]
• Stainless Steel: Fe + Ni + Cr + C [Rust-free and exceptionally hard].`
      }
    ],
    formulas: [
      { title: 'Thermite Reaction', formula: 'Fe₂O₃(s) + 2Al(s) → 2Fe(l) + Al₂O₃(s) + Heat', subtext: 'Exothermic railway welding' },
      { title: 'Amphoteric Reaction', formula: 'Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O', subtext: 'Sodium Aluminate formation' },
      { title: 'Roasting of Zinc Blende', formula: '2ZnS + 3O₂ → 2ZnO + 2SO₂↑', subtext: 'Conversion of sulfide ore to oxide' }
    ]
  },
  {
    id: 'science-4',
    num: 4,
    title: 'Carbon and its Compounds',
    hindiTitle: 'कार्बन एवं उसके यौगिक',
    weight: 7,
    unit: 'Unit I: Chemical Substances — Nature & Behaviour',
    file: 'science-04-carbon-and-its-compounds.md',
    topics: [
      {
        heading: '1. Covalent Bonding & Versatile Nature of Carbon',
        content: `**Electronic Configuration & Covalent Bond**:
Carbon has atomic number 6 with electronic configuration (2,4).
It cannot gain 4 electrons (forming C⁴⁻ is energetically unfavorable due to nucleus with 6 protons holding 10 electrons) nor lose 4 electrons (forming C⁴⁺ requires huge ionization energy).
Hence, carbon completes its octet by **sharing electrons** with other atoms, forming stable covalent bonds.

**Two Unique Properties of Carbon**:
1. **Catenation**: The unique ability of carbon atoms to form strong covalent bonds with other carbon atoms to yield long chains, branched structures, or rings.
2. **Tetravalency**: With a valency of four, carbon can bond with four other monovalent atoms (H, Cl) or divalent/trivalent atoms (O, N, S).

**Allotropes of Carbon**:
• **Diamond**: Each carbon atom is linked to four other carbon atoms in a rigid 3D tetrahedral network. Hardest substance, high melting point, electrical insulator.
• **Graphite**: Each carbon atom is bonded to three other carbon atoms in hexagonal planar layers held by weak van der Waals forces. Layers slide over each other (smooth, slippery lubricant). Free delocalized electrons make graphite a good electrical conductor.
• **Fullerenes**: C-60 buckminsterfullerene resembles a geodesic dome / soccer ball.`
      },
      {
        heading: '2. Hydrocarbons, Homologous Series & Functional Groups',
        content: `**Hydrocarbons**:
• **Saturated Hydrocarbons (Alkanes)**: Carbon atoms linked only by single covalent bonds. General formula: C_n H_{2n+2} (e.g., Methane CH₄, Ethane C₂H₆). Unreactive, undergo substitution reactions.
• **Unsaturated Hydrocarbons**:
  - **Alkenes (Double bond C=C)**: C_n H_{2n} (e.g., Ethene C₂H₄).
  - **Alkynes (Triple bond C≡C)**: C_n H_{2n-2} (e.g., Ethyne C₂H₂). Highly reactive, undergo addition reactions.

**Homologous Series**:
A family of organic compounds with identical functional groups and similar chemical properties where consecutive members differ by a **-CH₂- unit** and **14 atomic mass units (u)**.
Characteristics:
• Same general formula and chemical properties.
• Gradual gradation in physical properties (melting point, boiling point increase with molecular mass).

**Functional Groups**:
1. Alcohol: -OH (Methanol CH₃OH, Ethanol C₂H₅OH)
2. Aldehyde: -CHO (Methanal HCHO, Ethanal CH₃CHO)
3. Ketone: >C=O (Propanone CH₃COCH₃)
4. Carboxylic Acid: -COOH (Methanoic acid HCOOH, Ethanoic acid CH₃COOH)
5. Halogens: -Cl, -Br (Chloromethane CH₃Cl).`
      },
      {
        heading: '3. Important Carbon Compounds, Reactions & Cleansing Action of Soaps',
        content: `**Ethanol (C₂H₅OH)**:
• Colourless liquid, soluble in water in all proportions, active ingredient in alcoholic drinks.
• Reaction with Sodium: 2C₂H₅OH + 2Na → 2C₂H₅ONa (Sodium ethoxide) + H₂↑
• Dehydration: C₂H₅OH —(Conc. H₂SO₄, 443 K)→ CH₂=CH₂ (Ethene) + H₂O.

**Ethanoic Acid (CH₃COOH / Acetic Acid)**:
• 5-8% solution in water is called **Vinegar**. Pure acid freezes at 290 K, hence called **Glacial Acetic Acid**.
• **Esterification Reaction**:
  CH₃COOH + C₂H₅OH —(Conc. H₂SO₄)→ CH₃COOC₂H₅ (Ethyl ethanoate ester) + H₂O
  Esters have sweet, fruity smells; used in perfumes and flavoring agents.
• **Saponification Reaction**:
  CH₃COOC₂H₅ + NaOH → CH₃COONa (Soap) + C₂H₅OH.

**Cleansing Action of Soaps and Detergents**:
• **Soap Molecule Structure**: Sodium or potassium salt of long-chain fatty acids (e.g., C₁₇H₃₅COONa).
  - **Hydrophilic Head** (-COO⁻Na⁺): Water-loving, faces outward in water.
  - **Hydrophobic Tail** (Hydrocarbon chain): Water-hating, oil-loving, attaches to grease/dirt.
• **Micelle Formation**: In water, soap molecules arrange radially with hydrocarbon tails trapped inside oil droplets and ionic heads exposed to water, forming an emulsion that washes away with rinsing.
• **Hard Water Problem**: Hard water contains Ca²⁺ and Mg²⁺ salts, forming an insoluble curdy precipitate (**scum**) with soap. **Detergents** (ammonium or sulfonate salts) do not form scum with hard water.`
      }
    ],
    formulas: [
      { title: 'Esterification', formula: 'CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O', subtext: 'Acid-catalyzed sweet-smelling ester formation' },
      { title: 'Alkane General Formula', formula: 'C_n H_{2n+2}', subtext: 'Saturated open chain hydrocarbons' },
      { title: 'Saponification', formula: 'Ester + NaOH → Soap + Alcohol', subtext: 'Base-induced ester hydrolysis' }
    ]
  },
  {
    id: 'science-5',
    num: 5,
    title: 'Life Processes',
    hindiTitle: 'जैव प्रक्रम',
    weight: 8,
    unit: 'Unit II: World of Living',
    file: 'science-05-life-processes.md',
    topics: [
      {
        heading: '1. Autotrophic & Heterotrophic Nutrition',
        content: `**Life Processes Definition**:
The fundamental biological processes performed by living organisms to sustain life and repair damaged cellular tissues (Nutrition, Respiration, Transportation, Excretion).

**Autotrophic Nutrition (Photosynthesis)**:
Green plants synthesize glucose from inorganic carbon dioxide and water in the presence of sunlight and chlorophyll:
6CO₂ + 12H₂O —(Sunlight/Chlorophyll)→ C₆H₁₂O₆ + 6O₂ + 6H₂O

**Three Sequential Steps of Photosynthesis**:
1. Absorption of light energy by chlorophyll pigments.
2. Conversion of light energy into chemical energy and photolytic splitting of water molecules into hydrogen and oxygen.
3. Reduction of carbon dioxide into carbohydrates (glucose).
*Stomatal function*: Guard cells swell when water flows into them, opening the stomatal pore for gas exchange; shrink when losing water, closing the pore.

**Heterotrophic Nutrition**:
• **Holozoic**: Ingestion and internal digestion of solid food (Amoeba via pseudopodia, Paramecium via cilia, Humans).
• **Saprophytic**: Secreting enzymes to break down food outside and absorbing nutrients (Fungi, Bread mould, Mushrooms).
• **Parasitic**: Deriving nourishment from a host organism without killing it (Cuscuta/Amarbel, Ticks, Tapeworms).

**Human Alimentary Canal & Digestion**:
• **Mouth**: Teeth chew food; salivary amylase (ptyalin) breaks down starch into maltose.
• **Stomach**: Secretes gastric juice containing Hydrochloric Acid (creates acidic medium pH 1.2 to kill bacteria and activate pepsin), Pepsin (digests proteins), and Mucus (shields inner lining from HCl).
• **Small Intestine**: Complete site of digestion:
  - Liver secretes Bile: Emulsifies large fat globules into tiny droplets and makes food alkaline.
  - Pancreas secretes Pancreatic Juice: Trypsin (digests proteins) and Lipase (breaks down emulsified fats).
  - Villi: Finger-like projections in intestinal wall with dense blood vessels that maximize absorption surface area.
• **Large Intestine**: Absorbs remaining water; unabsorbed waste expelled via anus regulated by anal sphincter.`
      },
      {
        heading: '2. Cellular Respiration & Breakdown of Glucose',
        content: `**Cellular Respiration**:
Biochemical breakdown of glucose molecules to release energy in the form of **Adenosine Triphosphate (ATP)**, the energy currency of living cells.

**Glycolysis**: Initial breakdown of 6-carbon Glucose into two 3-carbon **Pyruvate** molecules in cytoplasm.

**Three Pathways of Pyruvate Breakdown**:
1. **Anaerobic in Yeast (Fermentation)**:
   In absence of Oxygen → Ethanol (C₂H₅OH) + CO₂ + 2 ATP.
2. **Anaerobic in Human Muscle Cells**:
   Under sudden vigorous exercise (lack of oxygen) → **Lactic Acid** (3-carbon) + 2 ATP. Accumulation of lactic acid causes severe muscle cramps.
3. **Aerobic Respiration in Mitochondria**:
   In presence of Oxygen → CO₂ + H₂O + **38 ATP** (Maximum energy efficiency).

**Human Respiratory System**:
Nostrils → Pharynx → Larynx → Trachea (supported by C-shaped cartilage rings to prevent collapse) → Bronchi → Bronchioles → **Alveoli**.
Alveoli are microscopic balloon-like sacs surrounded by extensive capillary networks where gaseous exchange occurs across thin diffusion membranes. Haemoglobin in red blood cells binds oxygen with high affinity.`
      },
      {
        heading: '3. Transportation in Humans and Plants',
        content: `**Human Circulatory System**:
Double circulation: Blood passes through the heart twice in one complete cardiac cycle (Pulmonary and Systemic circulation).
• **Heart Anatomy (4 chambers)**:
  - Right Atrium & Ventricle: Receive deoxygenated blood from body via Vena Cava and pump it to lungs via Pulmonary Artery.
  - Left Atrium & Ventricle: Receive oxygenated blood from lungs via Pulmonary Veins and pump it to systemic body tissues via Aorta.
  - Valves (Tricuspid, Bicuspid): Ensure unidirectional blood flow, preventing backflow during contraction.
• **Blood Components**: Plasma (fluid matrix), RBCs (haemoglobin), WBCs (immunity), Platelets (blood clotting at injury site).
• **Lymph**: Colourless extracellular fluid containing lymphocytes; drains excess interstitial fluid and carries digested fats from intestine.

**Transportation in Plants**:
• **Xylem**: Transports water and dissolved minerals unidirectionally from roots to leaves via suction pull generated by **Transpiration** (loss of water vapor through stomata).
• **Phloem**: Translocates soluble products of photosynthesis (sucrose, amino acids) bidirectionally using active transport requiring ATP energy.`
      },
      {
        heading: '4. Excretion in Humans and Plants',
        content: `**Human Excretory System**:
Pair of Kidneys, Pair of Ureters, Urinary Bladder, and Urethra.
• **Nephron (Functional filtration unit)**:
  1. **Glomerular Ultrafiltration**: High pressure in Bowman's capsule filters nitrogenous wastes (urea, uric acid), glucose, amino acids, and water from blood.
  2. **Selective Tubular Reabsorption**: Useful substances (all glucose, amino acids, major salts, and water) are actively reabsorbed into surrounding peritubular capillaries.
  3. **Tubular Secretion & Urine Collection**: Urine flows into collecting duct → Ureter → Urinary Bladder (muscular storage under nervous control).
• **Artificial Kidney (Haemodialysis)**: Cleans blood of patient suffering from kidney failure using semi-permeable cellulose tubes submerged in dialysing fluid without reabsorption.

**Plant Excretion**:
• Gaseous wastes (O₂, CO₂) exit through stomata and lenticels.
• Excess water eliminated via transpiration.
• Wastes stored in cellular vacuoles, shedding leaves, or stored as resins and gums in old xylem.`
      }
    ],
    formulas: [
      { title: 'Photosynthesis Equation', formula: '6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O', subtext: 'Light energy conversion in chloroplasts' },
      { title: 'Aerobic Respiration', formula: 'Glucose → Pyruvate → 6CO₂ + 6H₂O + 38 ATP', subtext: 'Mitochondrial complete oxidation' },
      { title: 'Muscle Anaerobic Respiration', formula: 'Pyruvate → Lactic Acid + 2 ATP', subtext: 'Causes muscle fatigue and cramps' }
    ]
  },
  {
    id: 'science-6',
    num: 6,
    title: 'Control and Coordination',
    hindiTitle: 'नियंत्रण एवं समन्वय',
    weight: 6,
    unit: 'Unit II: World of Living',
    file: 'science-06-control-and-coordination.md',
    topics: [
      {
        heading: '1. Human Nervous System, Neuron Structure & Reflex Action',
        content: `**Neuron (Nerve Cell)**:
Structural and functional unit of nervous system.
• **Dendrite**: Receives chemical signals and generates an electrical impulse.
• **Cell Body (Cyton)**: Contains nucleus and cytoplasm, transmits impulse to axon.
• **Axon**: Long cylindrical fiber carrying impulse away from cell body to terminal endings.
• **Synapse**: Microscopic junction between axon terminal of one neuron and dendrite of next neuron where electrical impulse releases chemical **neurotransmitters** (e.g., Acetylcholine) to cross the gap.

**Reflex Action & Reflex Arc**:
Sudden, involuntary, and protective response to an environmental stimulus without conscious brain deliberation.
• **Reflex Arc Pathway**:
  Receptor (skin/heat detector) → Sensory Neuron → Spinal Cord (Relay Neuron) → Motor Neuron → Effector Organ (muscle withdrawal).`
      },
      {
        heading: '2. Human Brain Anatomy & Functions',
        content: `The human brain is protected inside the bony cranium (skull) and surrounded by three protective meninges filled with shock-absorbing **Cerebrospinal Fluid (CSF)**.

**Brain Regions**:
1. **Forebrain**:
   - **Cerebrum**: Largest thinking part; controls intelligence, memory, speech, voluntary muscular movements, sensory associations (vision, hearing, smell).
2. **Midbrain**:
   - Coordinates involuntary reflexes of sight, hearing, and pupillary dilation.
3. **Hindbrain**:
   - **Cerebellum**: Controls posture, body balance, and precise voluntary movements (walking in a straight line, riding a bicycle, picking up a pen).
   - **Medulla Oblongata**: Controls crucial autonomic involuntary actions (heartbeat, blood pressure, salivation, swallowing, vomiting).
   - **Pons**: Regulates respiration rhythm and facial sensations.`
      },
      {
        heading: '3. Plant Hormones (Phytohormones) & Plant Movements',
        content: `**Plant Hormones (Phytohormones)**:
Chemical messengers synthesized in minute quantities that regulate growth and physiological responses:
1. **Auxin**: Synthesized at shoot tips; promotes cell elongation. Mediates **phototropism** by diffusing toward shaded side, causing faster elongation and bending toward light.
2. **Gibberellins**: Promote stem elongation, seed germination, and flowering.
3. **Cytokinins**: Promote rapid cell division; present in high concentration in fruits and seeds.
4. **Abscisic Acid (ABA)**: Plant growth inhibitor / stress hormone; causes stomatal closure and wilting/falling of leaves.

**Plant Movements**:
• **Tropic Movements (Directional growth responses)**:
  - Phototropism (toward light: shoots positive, roots negative)
  - Geotropism (gravity response: roots positive, shoots negative)
  - Hydrotropism (growth toward moisture/water)
  - Chemotropism (growth toward chemical stimulus, e.g., pollen tube growth toward ovule).
• **Nastic Movements (Non-directional turgor changes)**:
  - Thigmonasty in *Mimosa pudica* (Touch-me-not): Drooping of leaves caused by rapid potassium and water loss from pulvini cells upon touch.`
      },
      {
        heading: '4. Human Endocrine System & Hormones',
        content: `Endocrine glands are ductless glands that secrete chemical hormones directly into blood circulation:
1. **Pituitary Gland (Master Gland)**: Secretes **Growth Hormone (GH)**. Hyposecretion causes Dwarfism; hypersecretion causes Gigantism.
2. **Thyroid Gland**: Secretes **Thyroxin**. Regulates carbohydrate, protein, and fat metabolism for balanced growth. Requires dietary **Iodine**; deficiency causes thyroid enlargement (**Goitre**).
3. **Pancreas**: Secretes **Insulin**. Regulates blood glucose levels. Hyposecretion leads to **Diabetes Mellitus** (elevated blood sugar).
4. **Adrenal Glands**: Secrete **Adrenaline** (Emergency / Fight-or-Flight hormone). Increases heartbeat, breathing rate, and blood flow to skeletal muscles while constricting skin blood flow.
5. **Testes (Male)**: Secrete **Testosterone**. Controls development of male secondary sexual characteristics and sperm production.
6. **Ovaries (Female)**: Secrete **Estrogen** & **Progesterone**. Regulate female sexual development, menstrual cycle, and pregnancy maintenance.
• **Feedback Mechanism**: Regulates timing and quantity of hormone release (e.g., rising blood glucose triggers pancreas to produce insulin; drop in glucose stops secretion).`
      }
    ],
    formulas: [
      { title: 'Reflex Arc Chain', formula: 'Stimulus → Receptor → Sensory → Relay (Spinal) → Motor → Effector', subtext: 'Involuntary neural loop' },
      { title: 'Auxin Phototropic Bending', formula: 'Light from side → Auxin diffuses to shaded side → Cells elongate → Shoot bends', subtext: 'Mechanism of phototropism' }
    ]
  },
  {
    id: 'science-7',
    num: 7,
    title: 'Reproduction in Organisms',
    hindiTitle: 'जीव जनन कैसे करते हैं',
    weight: 7,
    unit: 'Unit II: World of Living',
    file: 'science-07-reproduction-in-organisms.md',
    topics: [
      {
        heading: '1. Asexual Reproduction Modes & Significance of DNA Copying',
        content: `**Importance of DNA Replication**:
Reproduction involves accurate duplication of DNA to transmit hereditary blueprints to offspring. Inherent minor chemical biochemical errors during DNA copying generate **variations**, which form the raw material for natural selection and species survival against climatic fluctuations.

**Modes of Asexual Reproduction**:
1. **Binary Fission**: Single-celled organism splits into two identical daughter cells (*Amoeba* in any plane; *Leishmania* with whip-like flagellum in fixed longitudinal plane).
2. **Multiple Fission**: Organism divides into numerous daughter cells simultaneously inside a protective cyst (*Plasmodium* malaria parasite).
3. **Fragmentation**: Multicellular body simply breaks into smaller fragments upon maturation, each growing into a new organism (*Spirogyra* filament).
4. **Regeneration**: Specialized cells proliferate to recreate complete organism from severed body parts (*Planaria*, *Hydra*).
5. **Budding**: Daughter bud grows out as outgrowth due to repeated cell division, detaches when mature (*Hydra*, Yeast).
6. **Vegetative Propagation**: New plants develop from vegetative parts (root, stem, leaves):
   - By leaves: Adventitious buds in notches of *Bryophyllum* leaf margin.
   - Artificial methods: Layering, grafting, cutting (Jasmine, Rose, Sugarcane).
7. **Spore Formation**: Microscopic spores encased in thick walls produced in sporangia on hyphae (*Rhizopus* bread mould).`
      },
      {
        heading: '2. Sexual Reproduction in Flowering Plants (Angiosperms)',
        content: `**Flower Anatomy**:
• **Non-essential Whorls**: Sepals (Calyx, green protection) and Petals (Corolla, coloured to attract pollinators).
• **Essential Reproductive Whorls**:
  - **Stamen (Male organ)**: Anther (produces pollen grains) + Filament.
  - **Carpel / Pistil (Female organ)**: Stigma (sticky receptive surface), Style (slender tube), and Ovary (swollen basal part enclosing ovules).

**Pollination & Fertilization**:
• **Pollination**: Transfer of pollen from anther to stigma (Self-pollination within same flower/plant; Cross-pollination between flowers via wind, water, insects).
• **Pollen Tube Growth**: Pollen grain germinates on stigma, forming a pollen tube traversing style to reach ovule micropyle.
• **Double Fertilization**:
  - **Syngamy**: First male gamete fuses with egg cell → Diploid Zygote → Embryo.
  - **Triple Fusion**: Second male gamete fuses with two polar nuclei → Triploid Endosperm (nutritive tissue).
• **Post-Fertilization Changes**:
  - Zygote develops into Embryo.
  - Ovule develops into hard-coated Seed.
  - Ovary wall ripens into Fruit. Sepals, petals, and stamens shrivel and fall off.`
      },
      {
        heading: '3. Human Reproductive Systems & Menstrual Cycle',
        content: `**Male Reproductive System**:
• **Testes**: Located outside abdominal cavity inside **Scrotum** to maintain 2–2.5°C lower temperature essential for spermatogenesis. Secrete testosterone.
• **Vas Deferens**: Conveys sperms from epididymis to urethra.
• **Accessory Glands**: Prostate gland and Seminal vesicles secrete alkaline fluid containing fructose that nourishes sperms and eases transport.

**Female Reproductive System**:
• **Ovaries**: Produce female gamete (ovum) and hormones (estrogen, progesterone).
• **Fallopian Tube (Oviduct)**: Site of fertilization where sperm meets ovum. Cilia push zygote toward uterus.
• **Uterus (Womb)**: Muscular pear-shaped organ where embryo implants in thick, vascular endometrium.
• **Placenta**: Disc-shaped vascular tissue embedded in uterine wall providing glucose and oxygen from maternal blood to fetus and removing embryo wastes via umbilical cord.

**Menstrual Cycle**:
If the released ovum is not fertilized:
The thick, cushioned endometrium breaks down. Unfertilized egg along with uterine lining and blood vessels sheds through vagina as menstrual flow lasting 3 to 8 days.`
      },
      {
        heading: '4. Reproductive Health & Contraceptive Methods',
        content: `**Sexually Transmitted Diseases (STDs)**:
• Bacterial STDs: Gonorrhoea, Syphilis.
• Viral STDs: Genital Warts, HIV-AIDS (incurable fatal immune deficiency).

**Contraceptive Methods**:
1. **Mechanical Barrier**: Condoms for males, Diaphragms/caps for females. Crucially prevent both unwanted pregnancy and STD transmission.
2. **Chemical Methods**: Oral contraceptive pills containing hormonal combinations that prevent ovulation.
3. **Intrauterine Contraceptive Devices (IUCDs)**: Copper-T or loops inserted into uterus by medical professionals to prevent embryo implantation.
4. **Surgical Methods (Permanent sterilization)**:
   - **Vasectomy**: Small portion of vas deferens in males is cut and tied.
   - **Tubectomy**: Small portion of fallopian tubes in females is cut and tied.`
      }
    ],
    formulas: [
      { title: 'Double Fertilization', formula: 'Male Gamete (n) + Egg (n) → Zygote (2n) | Male Gamete (n) + 2 Polar Nuclei (2n) → Endosperm (3n)', subtext: 'Flowering plant fertilization' }
    ]
  },
  {
    id: 'science-8',
    num: 8,
    title: 'Heredity',
    hindiTitle: 'आनुवंशिकता',
    weight: 4,
    unit: 'Unit II: World of Living',
    file: 'science-08-heredity.md',
    topics: [
      {
        heading: '1. Heredity, Inherited vs Acquired Traits & Mendel\'s Work',
        content: `**Heredity**: Transmission of genetically determined characters and traits from parents to their progeny.

**Inherited Traits vs Acquired Traits**:
• **Inherited Traits**: Caused by changes in the DNA of germ cells/gametes; transmitted across generations (e.g., eye colour, blood group, earlobe attachment).
• **Acquired Traits**: Changes developed in somatic/body tissues during an individual's lifetime due to environment or use/disuse; not coded in gamete DNA, cannot be inherited (e.g., muscle building, scar tissue, learning cycling).

**Gregor Johann Mendel (Father of Genetics)**:
Conducted landmark hybridization experiments on Garden Pea (*Pisum sativum*) choosing 7 pairs of contrasting characters (Tall/Dwarf, Round/Wrinkled seeds, Yellow/Green seeds, etc.) due to short lifespan, self-pollinating nature, and clear traits.`
      },
      {
        heading: '2. Monohybrid and Dihybrid Crosses',
        content: `**Monohybrid Cross (Inheritance of One Pair of Characters)**:
Cross between pure tall (TT) and pure dwarf (tt) pea plants:
• **F₁ Generation**: All plants are heterozygous Tall (Tt). (Shows Law of Dominance).
• **F₂ Generation (Self-pollination of Tt × Tt)**:
  - **Phenotypic Ratio**: 3 Tall : 1 Dwarf (3 : 1)
  - **Genotypic Ratio**: 1 Pure Tall (TT) : 2 Hybrid Tall (Tt) : 1 Pure Dwarf (tt) (1 : 2 : 1).

**Mendel\'s Laws**:
1. **Law of Dominance**: In a pair of dissimilar alleles, one dominant allele expresses itself while the recessive allele remains masked.
2. **Law of Segregation**: During gamete formation, paired alleles segregate cleanly so that each gamete carries only one allele.

**Dihybrid Cross (Inheritance of Two Pairs of Characters)**:
Cross between pure Round Yellow seeds (RRYY) and Wrinkled Green seeds (rryy):
• **F₁ Generation**: All Round Yellow (RrYy).
• **F₂ Generation Phenotypic Ratio**:
  9 Round Yellow : 3 Round Green : 3 Wrinkled Yellow : 1 Wrinkled Green (**9 : 3 : 3 : 1**).
• **Law of Independent Assortment**: Alleles of two distinct traits assort and combine independently of each other during gamete formation.`
      },
      {
        heading: '3. Sex Determination in Human Beings',
        content: `Humans possess **23 pairs of chromosomes** (46 chromosomes total):
• **22 pairs of Autosomes**: Identical in males and females.
• **1 pair of Sex Chromosomes (Allosomes)**:
  - Female genotype: **XX** (Homomorphic). Every ovum carries an X chromosome.
  - Male genotype: **XY** (Heteromorphic). Produces two types of sperms in equal 50% proportions (50% carrying X, 50% carrying Y).

**Sex Determination Mechanism**:
• Sperm with X + Ovum (X) → **XX zygote** → **Female child (Girl)**.
• Sperm with Y + Ovum (X) → **XY zygote** → **Male child (Boy)**.
Conclusion: The genetic sex of the unborn child is determined entirely by the paternal sperm, with an exact 50% statistical probability for either sex.`
      }
    ],
    formulas: [
      { title: 'Monohybrid Ratios', formula: 'Phenotypic = 3 : 1 | Genotypic = 1 : 2 : 1', subtext: 'Single-trait F₂ generation' },
      { title: 'Dihybrid Phenotypic Ratio', formula: '9 : 3 : 3 : 1 (Round Yellow : Round Green : Wrinkled Yellow : Wrinkled Green)', subtext: 'Two-trait F₂ generation' }
    ]
  },
  {
    id: 'science-9',
    num: 9,
    title: 'Light – Reflection and Refraction',
    hindiTitle: 'प्रकाश — परावर्तन तथा अपवर्तन',
    weight: 8,
    unit: 'Unit III: Physics Phenomena',
    file: 'science-09-light-reflection-and-refraction.md',
    topics: [
      {
        heading: '1. Reflection of Light & Spherical Mirrors',
        content: `**Laws of Reflection**:
1. The angle of incidence equals the angle of reflection: ∠i = ∠r.
2. The incident ray, the reflected ray, and the normal to the mirror at the point of incidence all lie in the same plane.

**Spherical Mirrors**:
• **Concave Mirror (Converging)**: Reflecting surface curved inward. Forms both real-inverted images and virtual-erect magnified images (when object between F and P).
  - Uses: Car headlights, torches, dentist dental examination mirrors, solar furnaces.
• **Convex Mirror (Diverging)**: Reflecting surface curved outward. Always forms virtual, erect, and diminished images with a broad rear field of view.
  - Uses: Rear-view mirrors in automobiles, security surveillance mirrors in stores.
• **Focal Length Relation**: f = R / 2 (R = Radius of curvature).`
      },
      {
        heading: '2. Mirror Formula, Sign Convention & Magnification',
        content: `**New Cartesian Sign Convention**:
1. All distances measured from the Optical Pole (P) along principal axis.
2. Distances in direction of incident ray taken as positive (+); opposite taken as negative (-).
3. Heights upward perpendicular to principal axis taken as positive (+); downward taken as negative (-).
4. Object distance (u) is always **negative**.
5. Concave mirror focal length (f) is always **negative**; Convex mirror focal length (f) is always **positive**.

**Mirror Formula**:
1/f = 1/v + 1/u

**Magnification (m)**:
m = Height of Image (h') / Height of Object (h) = -v / u
• If m is negative, image is **real and inverted**.
• If m is positive, image is **virtual and erect**.
• If |m| > 1, image is enlarged; if |m| < 1, image is diminished.`
      },
      {
        heading: '3. Refraction of Light, Snell\'s Law & Refractive Index',
        content: `**Refraction of Light**:
The bending of a ray of light when passing obliquely from one transparent optical medium to another due to change in the speed of light.
• Rarer to Denser medium: Light bends **towards the normal** (speed decreases).
• Denser to Rarer medium: Light bends **away from the normal** (speed increases).

**Snell\'s Law of Refraction**:
The ratio of sine of angle of incidence to the sine of angle of refraction is a constant for a given pair of media:
sin(i) / sin(r) = constant = n₂₁ (Refractive index of medium 2 with respect to medium 1).

**Absolute Refractive Index**:
n = Speed of light in vacuum (c) / Speed of light in medium (v) = (3 × 10⁸ m/s) / v.
• Optical density is not the same as mass density (e.g., Kerosene has higher optical density than water, yet lower mass density).`
      },
      {
        heading: '4. Spherical Lenses, Lens Formula & Power of a Lens',
        content: `**Convex Lens (Converging)**: Thicker at center than edges; positive focal length.
**Concave Lens (Diverging)**: Thicker at edges than center; negative focal length. Always produces virtual, erect, and diminished images.

**Lens Formula**:
1/f = 1/v - 1/u

**Lens Magnification**:
m = h' / h = +v / u

**Power of a Lens (P)**:
The degree of convergence or divergence of light rays achieved by a lens:
P = 1 / f (in meters)
• **SI Unit of Power**: **Dioptre (D)**. (1 D is the power of a lens of focal length 1 meter).
• Convex lens has **positive power (+D)**.
• Concave lens has **negative power (-D)**.
• **Lens Combination Power**: P = P₁ + P₂ + P₃...`
      }
    ],
    formulas: [
      { title: 'Mirror Formula', formula: '1/f = 1/v + 1/u', subtext: 'Spherical mirror relation' },
      { title: 'Lens Formula', formula: '1/f = 1/v - 1/u', subtext: 'Spherical lens relation' },
      { title: 'Optical Power', formula: 'P = 1 / f(in meters) [Unit: Dioptre (D)]', subtext: 'Lens refractive power' }
    ]
  },
  {
    id: 'science-10',
    num: 10,
    title: 'The Human Eye and the Colourful World',
    hindiTitle: 'मानव नेत्र तथा रंगबिरंगा संसार',
    weight: 4,
    unit: 'Unit III: Physics Phenomena',
    file: 'science-10-the-human-eye-and-the-colourful-world.md',
    topics: [
      {
        heading: '1. Human Eye Anatomy & Power of Accommodation',
        content: `**Key Structures of Human Eye**:
• **Cornea**: Thin, transparent front membrane through which light enters; provides 90% of optical refraction.
• **Iris**: Dark muscular diaphragm behind cornea that regulates the size of the pupil.
• **Pupil**: Aperture whose diameter is regulated by iris to control the amount of light entering the eye.
• **Crystalline Lens**: Convex, flexible fibrous jelly lens that provides fine focal adjustment.
• **Ciliary Muscles**: Modify the curvature and focal length of the crystalline lens.
• **Retina**: Light-sensitive back screen containing millions of photoreceptor cells (Rods detect light intensity; Cones detect colour).
• **Optic Nerve**: Transmits electrical nerve impulses from retina to brain.

**Power of Accommodation**:
The ability of the eye lens to adjust its focal length using ciliary muscles:
• For distant objects: Ciliary muscles relax, lens becomes thin (longer focal length).
• For nearby objects: Ciliary muscles contract, lens becomes thick/convex (shorter focal length).
• **Near Point of Distinct Vision**: 25 cm for a normal healthy young adult.
• **Far Point**: Infinity (∞).`
      },
      {
        heading: '2. Defects of Vision and Their Optical Correction',
        content: `**1. Myopia (Near-sightedness)**:
• A person can see nearby objects distinctly but cannot see distant objects clearly.
• Image of distant object forms **in front of retina**.
• Causes: (a) Excessive curvature of eye lens, (b) Elongation of eyeball.
• **Correction**: Diverging **Concave Lens** of suitable focal length that diverges incoming parallel rays so they appear to come from the person's defective far point.

**2. Hypermetropia (Far-sightedness)**:
• A person can see distant objects clearly but cannot see nearby objects distinctly.
• Image of nearby object forms **behind retina**.
• Causes: (a) Focal length of eye lens too long, (b) Eyeball too short.
• **Correction**: Converging **Convex Lens** of suitable focal length.

**3. Presbyopia (Old-Age Hypermetropia)**:
• Gradual weakening of ciliary muscles and diminishing lens flexibility with aging, causing difficulty in reading nearby text.
• **Correction**: **Bifocal Lens** (upper portion concave for distant vision, lower portion convex for reading).`
      },
      {
        heading: '3. Dispersion, Atmospheric Refraction & Scattering of Light',
        content: `**Dispersion through Triangular Glass Prism**:
White sunlight passing through a triangular glass prism splits into a spectrum of seven constituent colours: **VIBGYOR** (Violet, Indigo, Blue, Green, Yellow, Orange, Red).
• Red light has the longest wavelength and bends the **least**.
• Violet light has the shortest wavelength and bends the **most**.
• **Rainbow Formation**: Natural dispersion produced by airborne raindrops acting as tiny prisms. Light undergoes Refraction → Dispersion → Internal Reflection → Refraction.

**Atmospheric Refraction Phenomena**:
Atmosphere has varying layers of optical air density and temperature:
1. **Twinkling of Stars**: Continuous shifting of apparent star position due to atmospheric turbulence and refraction.
2. **Advanced Sunrise & Delayed Sunset**: Sun is visible 2 minutes before actual horizon crossing and remains visible 2 minutes after sunset (lengthening daytime by 4 minutes total).

**Scattering of Light (Tyndall Effect)**:
Scattering of light by colloidal particles:
• **Blue Colour of Sky**: Fine atmospheric molecules (N₂, O₂) scatter shorter blue wavelengths far more intensely than longer red wavelengths ($I \\propto 1/\\lambda^4$, Rayleigh scattering).
• **Red Colour of Sun at Sunrise/Sunset**: Sunlight traverses a thicker layer of atmosphere; blue light scatters away, leaving predominantly penetrating red wavelengths to reach our eyes.`
      }
    ],
    formulas: [
      { title: 'Normal Vision Range', formula: 'Near Point = 25 cm | Far Point = Infinity (∞)', subtext: 'Healthy human eye parameters' },
      { title: 'Rayleigh Scattering', formula: 'Scattering Intensity ∝ 1 / λ⁴', subtext: 'Wavelength dependence of light scattering' }
    ]
  },
  {
    id: 'science-11',
    num: 11,
    title: 'Electricity',
    hindiTitle: 'विद्युत',
    weight: 7,
    unit: 'Unit IV: Physics Phenomena',
    file: 'science-11-electricity.md',
    topics: [
      {
        heading: '1. Electric Charge, Current & Potential Difference',
        content: `**Electric Charge (Q)**:
Property of matter carried by electrons and protons. SI unit: **Coulomb (C)**.
• Charge on 1 electron: e = -1.6 × 10⁻¹⁹ C.
• Total charge formula: Q = n e (where n is integer count of electrons; 1 C contains 6.25 × 10¹⁸ electrons).

**Electric Current (I)**:
Rate of flow of electric charges across a conductor's cross-section:
I = Q / t
• **SI Unit**: **Ampere (A)**. (1 A = 1 Coulomb / 1 Second).
• Measured using an **Ammeter**, connected in **series** in the circuit (must have very low electrical resistance).

**Electric Potential Difference (V)**:
Work done (W) in moving a unit positive test charge from one point to another:
V = W / Q
• **SI Unit**: **Volt (V)**. (1 V = 1 Joule / 1 Coulomb).
• Measured using a **Voltmeter**, connected in **parallel** across resistor ends (has very high internal resistance).`
      },
      {
        heading: '2. Ohm\'s Law, Resistance & Factors Affecting Resistance',
        content: `**Ohm\'s Law**:
At constant temperature, the electric current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) across its ends:
V ∝ I ⟹ V = I R

**Resistance (R)**:
The property of a conductor to oppose the flow of electric charges.
• **SI Unit**: **Ohm (Ω)**. (1 Ω = 1 Volt / 1 Ampere).

**Factors Affecting Resistance of a Conductor**:
1. Directly proportional to length (l): R ∝ l.
2. Inversely proportional to area of cross-section (A): R ∝ 1/A.
3. Nature of material: R = ρ (l / A).
4. Temperature: Metallic resistance increases with temperature.

**Resistivity (ρ)**:
Characteristic material property independent of dimensions.
• **SI Unit**: **Ohm-meter (Ω·m)**.
• Conductors have low resistivity ($10^{-8}$ to $10^{-6}$ Ω·m).
• Insulators have huge resistivity ($10^{12}$ to $10^{17}$ Ω·m).
• **Alloys** (Nichrome, Constantan) have higher resistivity than constituent metals and do not oxidize/burn at high temperatures, making them ideal for heating elements in electric toasters and irons.`
      },
      {
        heading: '3. Resistors in Series and Parallel Combinations',
        content: `**1. Resistors in Series**:
Resistors connected end-to-end so that identical current (I) flows through each, but voltage divides (V = V₁ + V₂ + V₃):
R_s = R₁ + R₂ + R₃
• Disadvantages: If one component fails, whole circuit breaks; cannot operate devices with different current ratings.

**2. Resistors in Parallel**:
Resistors connected between two common nodes so that identical potential difference (V) exists across each, but current divides (I = I₁ + I₂ + I₃):
1 / R_p = 1 / R₁ + 1 / R₂ + 1 / R₃
• Advantages: Equivalent resistance decreases; each appliance receives full supply voltage; separate on/off switches possible; failure of one branch does not disrupt other branches.`
      },
      {
        heading: '4. Heating Effect of Electric Current & Electric Power',
        content: `**Joule\'s Law of Heating**:
Heat generated in a resistor is directly proportional to:
1. Square of current (I²),
2. Resistance of conductor (R),
3. Time duration of current flow (t):
H = I² R t = V I t = (V² / R) t
• Applications: Electric iron, electric heater, safety electric fuse (lead-tin alloy with low melting point).

**Electric Power (P)**:
Rate at which electrical energy is consumed:
P = V I = I² R = V² / R
• **SI Unit**: **Watt (W)**. (1 W = 1 Volt × 1 Ampere).
• **Commercial Unit of Energy**: **Kilowatt-hour (kWh)**, colloquially called "1 Unit" of electricity:
1 kWh = 1000 W × 3600 s = **3.6 × 10⁶ Joules**.`
      }
    ],
    formulas: [
      { title: 'Ohm\'s Law', formula: 'V = I R', subtext: 'Current-voltage relationship' },
      { title: 'Joule\'s Heating', formula: 'H = I² R t', subtext: 'Thermal energy dissipation' },
      { title: 'Commercial Energy Conversion', formula: '1 kWh = 3.6 × 10⁶ J', subtext: 'Kilowatt-hour to Joules' }
    ]
  },
  {
    id: 'science-12',
    num: 12,
    title: 'Magnetic Effects of Electric Current',
    hindiTitle: 'विद्युत धारा के चुंबकीय प्रभाव',
    weight: 6,
    unit: 'Unit IV: Physics Phenomena',
    file: 'science-12-magnetic-effects-of-electric-current.md',
    topics: [
      {
        heading: '1. Magnetic Field, Field Lines & Oersted\'s Discovery',
        content: `**Oersted\'s Experiment (1820)**:
Hans Christian Oersted discovered that a magnetic compass needle deflects when brought near a current-carrying metallic wire, proving that moving electric charges generate a magnetic field.

**Magnetic Field Lines Properties**:
1. Emerge from North Pole and enter South Pole outside the magnet; inside the magnet, they run from South to North, forming **closed continuous loops**.
2. Crowded near the poles where the magnetic field is strongest.
3. **Two magnetic field lines never cross each other**; if they intersected, the compass needle at the intersection point would point simultaneously in two distinct directions, which is physically impossible.`
      },
      {
        heading: '2. Magnetic Field of Current-Carrying Conductors & Solenoid',
        content: `**1. Straight Wire**:
Field lines form concentric circles centered on the wire.
• **Right-Hand Thumb Rule**: Imagine holding a current-carrying straight conductor in your right hand with thumb pointing in current direction; curled fingers encircle the wire in the direction of magnetic field lines.

**2. Solenoid**:
A coil of many circular turns of insulated copper wire wrapped closely in the shape of a cylinder.
• Produces a uniform, parallel magnetic field inside the solenoid, identical to a bar magnet.
• **Electromagnet**: A solenoid with a soft iron core inserted inside; acts as an intensely strong temporary magnet while current flows.`
      },
      {
        heading: '3. Force on Current Conductor in Magnetic Field & Left-Hand Rule',
        content: `**Magnetic Force on Conductor**:
A current-carrying conductor placed in an external magnetic field experiences a mechanical force, maximum when the conductor is perpendicular (90°) to the field lines.

**Fleming\'s Left-Hand Rule**:
Stretch the thumb, forefinger, and middle finger of the left hand mutually perpendicular to one another:
• **Forefinger** = Direction of Magnetic Field (B)
• **Middle Finger** = Direction of Electric Current (I)
• **Thumb** = Direction of Mechanical Force / Motion (F).`
      },
      {
        heading: '4. Domestic Electric Circuits & Electrical Safety',
        content: `**Domestic Wiring System (220 V AC, 50 Hz)**:
1. **Live Wire (Phase)**: Red insulation, carries high potential (+220 V).
2. **Neutral Wire**: Black insulation, zero potential (0 V). Potential difference = 220 V.
3. **Earth Wire**: Green insulation, connected to a metal plate buried deep in earth near house foundation.
   - *Safety Function of Earth Wire*: Connected to metallic bodies of high-power appliances (refrigerator, toaster, iron). In case of insulation leakage, charge drains safely into ground without giving lethal electric shock to user.

**Short-Circuiting & Overloading**:
• **Short-Circuit**: Live wire and neutral wire come in direct contact due to damaged insulation; circuit resistance drops to near zero, causing dangerous current surge and sparks.
• **Overloading**: Too many high-power appliances switched on simultaneously exceeding the circuit's rated current capacity.
• **Electric Fuse**: Crucial safety device containing low melting point wire that melts and interrupts circuit during excessive current flow.`
      }
    ],
    formulas: [
      { title: 'Fleming\'s Left-Hand Rule', formula: 'Thumb = Force | Forefinger = Field | Middle finger = Current', subtext: 'Direction of motor force' },
      { title: 'Domestic Power Rating', formula: '220 V AC, 50 Hz Frequency', subtext: 'Standard Indian household power' }
    ]
  },
  {
    id: 'science-13',
    num: 13,
    title: 'Our Environment',
    hindiTitle: 'हमारा पर्यावरण',
    weight: 5,
    unit: 'Unit V: Natural Resources & Environment',
    file: 'science-013-our-environment.md',
    topics: [
      {
        heading: '1. Ecosystem Components, Food Chains & 10% Energy Law',
        content: `**Ecosystem**:
A self-contained biological unit consisting of interacting **biotic components** (living organisms: producers, consumers, decomposers) and **abiotic components** (physical environment: sunlight, soil, water, temperature).
• **Producers**: Green plants and blue-green algae that synthesize organic food via photosynthesis using solar energy.
• **Consumers**: Herbivores (primary), Carnivores (secondary/tertiary), and Omnivores.
• **Decomposers**: Microorganisms (bacteria and fungi) that break down dead remains and organic waste into simple inorganic nutrients, returning them to the soil and maintaining environmental balance.

**Food Chain & Trophic Levels**:
A sequential series of organisms where each feeds on the preceding one:
Trophic Levels: Producers (Level 1) → Herbivores (Level 2) → Small Carnivores (Level 3) → Top Carnivores (Level 4).

**Lindeman\'s 10% Law of Energy Transfer**:
Green plants capture only ~1% of solar energy incident on their leaves.
At each subsequent trophic level, **only 10% of the energy is transferred** to the next trophic level; 90% is dissipated as metabolic heat into the environment.
*Consequence*: Energy flow in an ecosystem is strictly **unidirectional**. Food chains rarely exceed 3 to 4 trophic levels because negligible energy remains after 4 transfers.`
      },
      {
        heading: '2. Biological Magnification (Biomagnification)',
        content: `**Definition**:
The progressive accumulation and increasing concentration of persistent, non-biodegradable harmful chemicals (like pesticides, heavy metals, DDT) in the bodies of organisms at each successively higher trophic level in a food chain.

**Key Features**:
• Non-biodegradable pollutants sprayed on crops wash into soil/water and enter plants.
• Because these chemicals cannot be metabolized or excreted, they concentrate progressively up the chain.
• **Maximum concentration occurs at the highest trophic level** (humans as top carnivores), causing neurological disorders, reproductive damage, and organ failures.`
      },
      {
        heading: '3. Ozone Layer Depletion & Waste Management',
        content: `**Ozone Layer (O₃) in Stratosphere**:
Protects terrestrial biosphere by filtering out lethal ultraviolet (UV-B) radiation emitted by the sun.
• **Ozone Formation**:
  High-energy UV breaks atmospheric O₂: O₂ —(UV)→ O + O
  Nascent oxygen combines with molecular oxygen: O + O₂ → O₃.
• **Ozone Depletion**:
  Synthetic chemicals like **Chlorofluorocarbons (CFCs)** used in refrigerants and fire extinguishers release reactive chlorine free radicals that catalytically destroy ozone molecules.
  *Montreal Protocol (1987)*: Global UN agreement successfully freezing CFC production worldwide.

**Solid Waste Management**:
• **Biodegradable Wastes**: Decomposed by bacterial action into simple harmless substances (food scraps, vegetable peels, cattle dung, paper).
• **Non-Biodegradable Wastes**: Persist in the environment for hundreds of years, causing acute soil and water pollution (plastics, polythene bags, electronic waste).
• **Safe Disposal**: Composting, Vermicomposting, Incineration of hospital waste, Recycling, and the 5 R principles (Refuse, Reduce, Reuse, Repurpose, Recycle).`
      }
    ],
    formulas: [
      { title: '10% Energy Transfer', formula: 'Energy at Trophic Level (N+1) = 0.10 × Energy at Trophic Level N', subtext: 'Lindeman\'s Energy Law' },
      { title: 'Ozone Formation', formula: 'O₂ —(UV)→ O + O | O + O₂ → O₃', subtext: 'Photochemical stratospheric ozone generation' }
    ]
  }
]

export { SCIENCE_CHAPTERS_METADATA }
