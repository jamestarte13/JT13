export const violationTypes = [
  'Alternate Side Parking',
  'Expired Meter',
  'No Standing Zone',
  'Fire Hydrant',
  'Bus Stop',
  'Blocked Driveway',
  'Double Parking',
  'Street Cleaning',
  'No Parking Zone',
  'Other',
]

export const defenseReasons = [
  'Signs were missing or obscured',
  'I was not the driver / vehicle was sold',
  'Medical emergency required stopping',
  'Meter was broken or malfunctioning',
  'I paid but machine didn\'t register',
  'Signs were contradictory or confusing',
  'Vehicle was disabled / mechanical failure',
  'I was loading/unloading within legal time',
  'Officer error — wrong plate or location',
  'Other',
]

export const successLikelihood = {
  'Signs were missing or obscured':           { pct: 78, label: 'Strong',      color: '#4ade80', tip: 'Missing or obscured signage is one of the most commonly upheld defenses. Document with photos immediately.' },
  'Officer error — wrong plate or location':  { pct: 82, label: 'Very Strong', color: '#4ade80', tip: 'Factual errors on a summons are grounds for automatic dismissal. Highlight the exact discrepancy clearly.' },
  'I paid but machine didn\'t register':      { pct: 71, label: 'Strong',      color: '#4ade80', tip: 'Known issue with NYC meters. Any receipt or bank transaction screenshot significantly strengthens your case.' },
  'Meter was broken or malfunctioning':       { pct: 68, label: 'Strong',      color: '#4ade80', tip: 'Report the broken meter to 311 immediately if you haven\'t. A 311 complaint log supports your case.' },
  'Signs were contradictory or confusing':    { pct: 65, label: 'Good',        color: '#facc15', tip: 'Courts side with drivers when signage is genuinely ambiguous. Photos of all nearby signs are essential.' },
  'I was loading/unloading within legal time':{ pct: 58, label: 'Good',        color: '#facc15', tip: 'You must have been present with the vehicle. A witness statement or delivery receipt helps significantly.' },
  'Vehicle was disabled / mechanical failure':{ pct: 54, label: 'Moderate',    color: '#facc15', tip: 'A repair invoice or roadside assistance record dated the same day will make or break this defense.' },
  'Medical emergency required stopping':      { pct: 51, label: 'Moderate',    color: '#facc15', tip: 'Any documentation — hospital visit, prescription, witness — greatly improves your odds.' },
  'I was not the driver / vehicle was sold':  { pct: 74, label: 'Strong',      color: '#4ade80', tip: 'Bill of sale or transfer documentation is highly persuasive. Include a copy with your dispute.' },
  'Other':                                    { pct: 38, label: 'Variable',    color: '#f97316', tip: 'Success depends heavily on your specific circumstances. Be as specific and factual as possible.' },
}

export const defenseArguments = {
  'Signs were missing or obscured': `At the time of the alleged violation, the posted signage at this location was either missing, damaged, obscured by vegetation or other obstructions, or otherwise rendered illegible. Under NYC Traffic Rules §4-08(a)(1), a parking restriction is only enforceable when signs are clearly visible and legible to a reasonable motorist. Without proper notice of the restriction, I had no means of knowing that parking was prohibited. I respectfully request that this ticket be dismissed on the grounds that the signage failed to provide adequate notice as required by law.`,
  'I was not the driver / vehicle was sold': `I was not operating or in possession of this vehicle at the time of the alleged violation. The vehicle associated with the plate number listed on this summons was either sold prior to this date or operated by another individual without my knowledge or consent. Under NYC Administrative Code §19-213, liability for parking violations rests with the operator of the vehicle, not the registered owner, when ownership has transferred or the vehicle was used without authorization. I respectfully request dismissal of this summons.`,
  'Medical emergency required stopping': `At the time of the alleged violation, I was responding to a genuine medical emergency that necessitated an immediate, unplanned stop. The urgency of the situation made compliance with posted parking restrictions impossible without risk of serious harm. NYC Traffic Rules recognize that emergency circumstances may justify temporary non-compliance. I respectfully request that this summons be dismissed in light of these extraordinary and unforeseeable circumstances, which were entirely beyond my control.`,
  'Meter was broken or malfunctioning': `At the time of the alleged violation, the parking meter at this location was malfunctioning and failed to accept payment despite my repeated attempts. Under NYC Traffic Rules §4-08(k)(1), a motorist cannot be held liable for a meter violation when the meter is out of service or inoperable. I made every reasonable effort to comply with the parking regulations and should not be penalized for a malfunction of city-maintained equipment. I respectfully request dismissal of this summons.`,
  'I paid but machine didn\'t register': `I paid the required parking fee at the time of the alleged violation; however, the payment was not properly registered by the meter or pay station. Despite completing the transaction, no receipt was issued or the display failed to confirm payment. This is a known technical issue with certain NYC parking systems. I should not be penalized for a failure of city-operated payment equipment. I respectfully request that this summons be dismissed.`,
  'Signs were contradictory or confusing': `The signage at the location of the alleged violation was contradictory, ambiguous, or so confusing that a reasonable and prudent motorist could not determine whether parking was permitted. Multiple signs in close proximity conveyed conflicting information, making compliance impossible. NYC courts have consistently held that ambiguous or contradictory signage cannot form the basis for a valid parking summons. I respectfully request dismissal on these grounds.`,
  'Vehicle was disabled / mechanical failure': `At the time of the alleged violation, my vehicle experienced an unexpected mechanical failure that rendered it inoperable. The vehicle could not be moved safely or legally without professional assistance. This situation was entirely unforeseeable and beyond my control. I took immediate steps to address the breakdown and had the vehicle removed as soon as reasonably possible. I respectfully request dismissal of this summons.`,
  'I was loading/unloading within legal time': `At the time of the alleged violation, I was actively engaged in the loading or unloading of passengers or goods, which is a permitted activity under NYC Traffic Rules §4-08(f). The duration of my stop was consistent with what is reasonably necessary for such activity, and I was present with the vehicle throughout. The summons was issued in error, as my actions fell within the legal exception for loading and unloading. I respectfully request that this ticket be dismissed.`,
  'Officer error — wrong plate or location': `Upon careful review of this summons, I believe it contains a material error — either in the license plate number recorded, the location described, or another identifying detail. These discrepancies go to the fundamental accuracy of the summons and raise serious doubt as to whether this ticket was properly issued to my vehicle. Under NYC Administrative Code, a summons containing factual errors is subject to dismissal. I respectfully request that this matter be reviewed and the summons dismissed.`,
  'Other': `I am writing to contest this parking summons in good faith. After careful review of the circumstances surrounding the alleged violation, I believe this ticket was issued in error or under circumstances that do not warrant a penalty. I respectfully request that a hearing officer review the details of this case and consider dismissal of this summons based on the facts as I have presented them.`,
}

export const violationTips = {
  'Alternate Side Parking': [
    'Photo of the street sign showing alternate side parking hours — especially if partially obscured, faded, or hard to read.',
    'Screenshot of the NYC 311 or DOT alternate side parking suspension calendar showing parking was suspended on that date.',
    'Timestamped receipt or parking app record showing you moved or paid before the restriction began.',
  ],
  'Expired Meter': [
    'Photo of the meter display showing a malfunction, error message, or your payment receipt from the transaction.',
    'Screenshot of your bank or credit card statement showing the meter charge successfully processed.',
    'A 311 complaint log or photo of an "Out of Service" notice if the meter was broken or not accepting payment.',
  ],
  'No Standing Zone': [
    'Photo of the no standing sign — especially if it was obscured, missing, or contradicted by a nearby sign.',
    'Photo or timestamped image showing active loading or unloading activity at the time of the alleged violation.',
    'Timestamped photo of your vehicle\'s position relative to the nearest intersection or landmark.',
  ],
  'Fire Hydrant': [
    'Photo showing the measured or estimated distance between your vehicle and the hydrant (15 feet is the legal minimum clearance).',
    'Photo showing if the hydrant was recessed, painted over, or otherwise not clearly visible from the street.',
    'Photo of the curb showing faded or missing yellow markings that would indicate the hydrant zone.',
  ],
  'Bus Stop': [
    'Photo of the bus stop sign — especially if it was missing, damaged, or had faded pavement markings.',
    'Timestamped photo or receipt showing you were present for only a brief moment (loading/unloading exception applies).',
    'Witness statement or documentation confirming there was no bus actively using that stop at the time.',
  ],
  'Blocked Driveway': [
    'Photo showing your vehicle\'s exact position relative to the driveway — pay attention to whether the curb cut was fully blocked.',
    'Written permission or communication from the property owner confirming they authorized your vehicle to be there.',
    'Photo showing the curb cut was poorly marked, faded, or indistinguishable from a regular curb at that location.',
  ],
  'Double Parking': [
    'Photo showing your vehicle was parallel to the curb and not obstructing the flow of traffic in the travel lane.',
    'Timestamped receipt, delivery confirmation, or bill of lading showing this was a required commercial loading stop.',
    'Witness statement or note from a nearby business confirming you were actively loading or unloading at the time.',
  ],
  'Street Cleaning': [
    'Screenshot of the NYC 311 or DOT announcement confirming street cleaning was suspended on that specific day.',
    'Photo of the street cleaning sign — especially if the hours or days were unclear, contradicted by another sign, or obscured.',
    'Bank statement, parking app receipt, or meter receipt showing you moved or paid before the restriction began.',
  ],
  'No Parking Zone': [
    'Photo of the no parking sign — especially if obscured by a tree, large vehicle, or contradicted by a nearby sign.',
    'Timestamped photo showing your vehicle arrived and parked before the restriction hours began.',
    'Documentation of an emergency, authorized permit, or delivery that legally required you to stop at that location.',
  ],
  'Other': [
    'Timestamped photos of the exact location where your vehicle was parked and all surrounding signage.',
    'Any receipts, transaction records, or documentation relevant to your specific reason for being parked there.',
    'A written witness statement from anyone who can corroborate your account of the situation.',
  ],
}

export const teaserTips = [
  { number: '01', icon: '⏰', title: 'Submit Within 30 Days.', body: 'If you miss your deadline you won\'t be eligible to fight. Submit the same week you get it.' },
  { number: '02', icon: '🚫', title: 'Never Pay Before You Dispute.', body: 'Any payment is treated as a guilty plea. You forfeit your right to contest the moment you pay.' },
  { number: '03', icon: '📸', title: 'Photos Win Cases.', body: 'A dated photo of a missing or obscured sign will help your case. Document everything immediately before anything changes.' },
  { number: '04', icon: '🔍', title: 'Check for Ticket Errors.', body: 'Incorrect plate number, date, wrong location — any factual error on the ticket is grounds for immediate dismissal.' },
]

export const testimonials = [
  { quote: 'Ticket dismissed on the first try. Saved me $115 and maybe 3 hours of stress.', name: 'Marcus T.', location: 'Crown Heights, Brooklyn' },
  { quote: 'I had no idea my expired meter ticket could be fought. Created my letter in under 2 minutes.', name: 'Priya S.', location: 'Astoria, Queens' },
  { quote: 'So easy to use. Created my letter, submitted it directly online, and the judge ruled in my favor within 10 days.', name: 'Danny R.', location: 'Hell\'s Kitchen, Manhattan' },
  { quote: 'Got hit with an alternate side ticket even though the sign was completely blocked by a truck. This tool helped me explain that clearly.', name: 'Sandra L.', location: 'Riverdale, Bronx' },
]

export const faqs = [
  { q: 'Does this actually work?', a: 'NYC parking disputes have a surprisingly high dismissal rate — especially when the letter is well-written and evidence is included. Our letters cite real NYC Traffic Rules and are formatted exactly as judges expect.' },
  { q: 'How long does the dispute process take?', a: 'If you submit online, a hearing is typically scheduled within 45 days. Once your dispute is received, the DOF puts your case on hold, pausing any late fees. Decisions are usually issued about 10 days after your hearing.' },
  { q: 'What if my dispute is denied?', a: 'You still have options. If a judge finds you guilty, you have 30 days to file a formal dispute with the NYC DOF Disputes Board at nyc.gov/finance.' },
  { q: 'Is my information safe?', a: 'Yes. We collect only your email and the ticket details you provide. We never sell your data or share it with third parties.' },
  { q: 'Can I use this for camera violations?', a: 'This tool is designed for parking summons issued by NYC parking enforcement officers. Camera violations follow a different dispute process — we\'re working on expanding to cover those.' },
  { q: 'Do I need a lawyer?', a: 'Not for most parking disputes. The NYC Parking Violations Bureau is designed for self-representation. Our letters are written at the level of a legal professional but in plain language judges appreciate.' },
]

export const guideSteps = [
  { icon: '⏰', title: 'Act Within 30 Days — No Exceptions', content: 'You have exactly 30 days from the date on your ticket to submit your dispute. Miss this deadline and you lose the right to contest it entirely. The ticket will go to judgment and penalties will begin accruing. Submit as soon as possible — ideally within the first week.' },
  { icon: '📸', title: 'Gather Your Evidence First', content: 'Before submitting, collect everything that supports your case. Photos are your most powerful tool — take pictures of the street signs (or lack thereof), the meter, any obstructions, and your car\'s position. Make sure photos are date-and-time stamped. Submit copies only — never originals.' },
  { icon: '🖥️', title: 'How to Submit Your Dispute', content: 'Online is fastest: go to nyc.gov/finance, navigate to \'Dispute a Ticket\', and upload your letter and evidence directly. By mail: NYC Dept of Finance, Hearings By Mail Unit, P.O. Box 29021, Cadman Plaza Station, Brooklyn, NY 11202-9021. In person: any NYC Finance Business Center Monday–Friday, 8:30am–4:30pm for a same-day decision.' },
  { icon: '✅', title: 'Double-Check the Ticket for Errors', content: 'Check that your license plate number, vehicle make and model, date, time, and location are all correctly recorded. Any factual error — even a wrong plate digit — can be grounds for automatic dismissal. Note any discrepancies clearly in your dispute letter.' },
  { icon: '📝', title: 'Writing Tips for a Stronger Dispute', content: 'Keep your letter factual, professional, and concise. Judges respond to evidence, not frustration. Be specific: include exact times, addresses, and what you observed. Corroborate your facts wherever possible with photos, receipts, or witness statements. A sworn statement carries more weight than an unsworn one.' },
  { icon: '📬', title: 'What Happens After You Submit', content: 'If submitted online, a hearing will be scheduled within 45 days. The Department of Finance will put your case on hold, pausing additional fees. You should receive a decision approximately 10 days after your hearing. Check your status at any time on the NYC Finance website using your ticket number.' },
  { icon: '🏆', title: 'If Your Dispute Is Dismissed', content: 'If a judge finds you guilty, you have 30 days to file a formal dispute with the NYC DOF Disputes Board. Mail to: NYC Dept of Finance, Adjudication Division - Disputes Unit, 66 John Street, 3rd Floor, New York, NY 10038. A decision will be mailed within 60 days.' },
  { icon: '⚠️', title: 'Important: Don\'t Make These Mistakes', content: 'Never pay the ticket before your dispute — paying is a guilty plea and waives your right to contest. Don\'t miss the 30-day deadline. Don\'t submit original documents — only copies. Don\'t use emotional language. And if outstanding fines exceed $350, your vehicle can be booted while an dispute is pending.' },
]

export function buildDateOptions() {
  const options = []
  const now = new Date()
  for (let y = now.getFullYear(); y >= now.getFullYear() - 2; y--) {
    const maxMonth = y === now.getFullYear() ? now.getMonth() : 11
    for (let m = maxMonth; m >= 0; m--) {
      const maxDay =
        y === now.getFullYear() && m === now.getMonth()
          ? now.getDate()
          : new Date(y, m + 1, 0).getDate()
      for (let d = maxDay; d >= 1; d--) {
        const date = new Date(y, m, d)
        const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        options.push({ value: label, label })
      }
    }
  }
  return options
}

export function createLetter(form, exhibits = []) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const defenseText = (form.defense === 'Other' && form.otherDefense?.trim())
    ? form.otherDefense.trim()
    : (defenseArguments[form.defense] || defenseArguments['Other'])
  const extra = form.extraDetails ? `\nAdditional context: ${form.extraDetails}\n` : ''
  const enclosures =
    exhibits.length > 0
      ? `\n\nEnclosures:\n${exhibits.map((ex, i) => `  Exhibit ${String.fromCharCode(65 + i)} — ${ex.label}`).join('\n')}`
      : ''

  return `${today}

NYC Department of Finance
Parking Violations Bureau
P.O. Box 3600
New York, NY 10008-3600

Re: Dispute of Parking Summons
Summons Number: ${form.ticketNumber}
Plate Number: ${form.plateNumber || 'On File'}
Violation Date: ${form.date}
Location: ${form.location}
Violation: ${form.violation}
Fine Amount: $${form.amount}

To Whom It May Concern:

I am writing to formally dispute the above-referenced parking summons issued on ${form.date} at ${form.location}. I respectfully contest this violation on the following grounds:

${defenseText}
${extra}
I have been a law-abiding motorist and have no interest in evading legitimate parking enforcement. However, in this instance, I firmly believe the summons was issued under circumstances that do not justify a penalty, and I respectfully request that it be dismissed in full.

I am available to provide any additional information, photographs, or documentation that may assist in the review of this matter. Thank you for your time and consideration.

Respectfully submitted,

${form.name}${enclosures}`
}
