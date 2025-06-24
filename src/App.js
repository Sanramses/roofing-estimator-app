import React, { useState, useRef } from 'react';
import { Camera, Upload, Calculator, FileText, Euro, Home, AlertCircle, CheckCircle } from 'lucide-react';

const RoofingEstimatorApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [roofData, setRoofData] = useState({
    length: '',
    width: '',
    roofType: 'tuile',
    condition: 'good',
    location: 'Paris',
    urgency: 'normal'
  });
  const [estimate, setEstimate] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const roofTypes = {
    tuile: { name: 'Tuile en terre cuite', price: 45 },
    ardoise: { name: 'Ardoise naturelle', price: 85 },
    zinc: { name: 'Zinc', price: 65 },
    shingle: { name: 'Shingle bitumineux', price: 25 }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: event.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const calculateEstimate = () => {
    setIsProcessing(true);
    
    // Simulare AI processing
    setTimeout(() => {
      const surface = parseFloat(roofData.length) * parseFloat(roofData.width);
      const basePrice = roofTypes[roofData.roofType].price;
      const conditionMultiplier = roofData.condition === 'poor' ? 1.3 : roofData.condition === 'fair' ? 1.1 : 1;
      const urgencyMultiplier = roofData.urgency === 'urgent' ? 1.2 : 1;
      
      const materialCost = surface * basePrice * conditionMultiplier;
      const laborCost = surface * 35; // €35/m² pour la main d'œuvre
      const additionalCosts = materialCost * 0.15; // 15% pour divers
      
      const totalCost = (materialCost + laborCost + additionalCosts) * urgencyMultiplier;
      
      setEstimate({
        surface: surface,
        materialCost: materialCost,
        laborCost: laborCost,
        additionalCosts: additionalCosts,
        totalCost: totalCost,
        timeline: roofData.urgency === 'urgent' ? '2-3 jours' : '1-2 semaines',
        materials: [
          { item: roofTypes[roofData.roofType].name, quantity: Math.ceil(surface * 1.1), unit: 'm²', price: basePrice },
          { item: 'Liteaux', quantity: Math.ceil(surface * 3), unit: 'ml', price: 4.5 },
          { item: 'Écran sous-toiture', quantity: Math.ceil(surface * 1.1), unit: 'm²', price: 3.2 },
          { item: 'Clous et fixations', quantity: 1, unit: 'lot', price: 150 }
        ]
      });
      setIsProcessing(false);
      setCurrentStep(4);
    }, 2500);
  };

  const resetApp = () => {
    setCurrentStep(1);
    setImages([]);
    setRoofData({
      length: '',
      width: '',
      roofType: 'tuile',
      condition: 'good',
      location: 'Paris',
      urgency: 'normal'
    });
    setEstimate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Home className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">RoofEstimate Pro</h1>
                <p className="text-gray-600">Estimations instantanées avec IA</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1: Upload Photos */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Étape 1: Photos du toit
            </h2>
            
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-blue-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Uploadez des photos de votre toit (minimum 2 photos recommandées)
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Choisir photos
              </button>
            </div>

            {images.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Photos uploadées ({images.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Continuer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Roof Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Étape 2: Détails du toit
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longueur (mètres)
                </label>
                <input
                  type="number"
                  value={roofData.length}
                  onChange={(e) => setRoofData({...roofData, length: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Largeur (mètres)
                </label>
                <input
                  type="number"
                  value={roofData.width}
                  onChange={(e) => setRoofData({...roofData, width: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 8"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de couverture
                </label>
                <select
                  value={roofData.roofType}
                  onChange={(e) => setRoofData({...roofData, roofType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(roofTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  État actuel
                </label>
                <select
                  value={roofData.condition}
                  onChange={(e) => setRoofData({...roofData, condition: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="good">Bon état</option>
                  <option value="fair">État moyen</option>
                  <option value="poor">Mauvais état</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  value={roofData.location}
                  onChange={(e) => setRoofData({...roofData, location: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ville"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgence
                </label>
                <select
                  value={roofData.urgency}
                  onChange={(e) => setRoofData({...roofData, urgency: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Retour
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!roofData.length || !roofData.width}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Analyser avec IA
              </button>
            </div>
          </div>
        )}

        {/* Step 3: AI Processing */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center">
              <Calculator className="mr-2 h-5 w-5" />
              Analyse IA en cours...
            </h2>
            
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <div className="space-y-2">
                <p className="text-gray-600">🔍 Analyse des photos uploadées...</p>
                <p className="text-gray-600">📐 Calcul automatique des surfaces...</p>
                <p className="text-gray-600">💰 Estimation des coûts matériaux...</p>
                <p className="text-gray-600">⚡ Génération du devis détaillé...</p>
              </div>
            </div>
            
            <button
              onClick={calculateEstimate}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Générer l'estimation
            </button>
          </div>
        )}

        {/* Step 4: Estimate Results */}
        {currentStep === 4 && estimate && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Estimation Complète
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Surface totale</p>
                  <p className="text-2xl font-bold text-blue-600">{estimate.surface} m²</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Délai estimé</p>
                  <p className="text-2xl font-bold text-green-600">{estimate.timeline}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Euro className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Coût total</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(estimate.totalCost).toLocaleString()} €</p>
                </div>
              </div>
              
              {/* Cost Breakdown */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Détail des coûts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Matériaux</span>
                    <span className="font-semibold">{Math.round(estimate.materialCost).toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Main d'œuvre</span>
                    <span className="font-semibold">{Math.round(estimate.laborCost).toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Divers (15%)</span>
                    <span className="font-semibold">{Math.round(estimate.additionalCosts).toLocaleString()} €</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center text-lg font-bold">
                    <span>Total TTC</span>
                    <span>{Math.round(estimate.totalCost).toLocaleString()} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Materials List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-semibold mb-4">Liste des matériaux</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Matériau</th>
                      <th className="text-left py-2">Quantité</th>
                      <th className="text-left py-2">Prix unitaire</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimate.materials.map((material, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{material.item}</td>
                        <td className="py-2">{material.quantity} {material.unit}</td>
                        <td className="py-2">{material.price} €</td>
                        <td className="py-2 text-right font-semibold">
                          {Math.round(material.quantity * material.price)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Imprimer le devis
                </button>
                <button
                  onClick={resetApp}
                  className="flex-1 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  Nouvelle estimation
                </button>
                <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 flex items-center justify-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accepter le devis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>RoofEstimate Pro - Solution professionnelle pour couvreurs</p>
          <p>Estimations précises grâce à l'intelligence artificielle</p>
        </div>
      </div>
    </div>
  );
};

export default RoofingEstimatorApp;
