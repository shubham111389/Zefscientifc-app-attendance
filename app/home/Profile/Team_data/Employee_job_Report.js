import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import LoadingScreen from '../LoadingScreen';


import Footer from '../Footer';

const Employee_job_Report = () => {
  const { employeeName, jobRegisterData } = useLocalSearchParams();
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Parse the jobRegisterData passed from Teams component
      const parsedData = JSON.parse(jobRegisterData || '[]');
      setFilteredData(parsedData);
    } catch (error) {
      console.error('Error parsing job register data:', error);
      
    } finally {
      setLoading(false);
    }
  }, [jobRegisterData]);


  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status?.trim().toLowerCase()) {
      case 'working':
        return '#92C353';
      case 'holiday':
        return '#C4314B';
      case 'leave':
        return '#FFB900';
      default:
        return '#6264A7';
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const renderInfoRow = (icon, label, value) => {
    if (!value || value === "undefined") return null;
    
    return (
      <View style={styles.infoRow}>
        <MaterialIcons name={icon} size={20} color="#6264A7" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>{label}:</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#201F1F', '#2D2C2C']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <MaterialIcons name="work" size={28} color="#6264A7" />
            <Text style={styles.headerTitle}>Job Register</Text>
          </View>
          <Text style={styles.employeeName}>{employeeName}</Text>
        </View>

        {filteredData.length !== 0 ? (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {filteredData.map((item, index) => (
              <View key={index} style={styles.card}>
                <LinearGradient
                  colors={['rgba(98, 100, 167, 0.05)', 'rgba(98, 100, 167, 0.02)']}
                  style={styles.cardGradient}
                >
                  {renderInfoRow("event", "Date", formatDate(item.Date))}
                  
                  <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.WorkingStatus)}20` }]}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.WorkingStatus) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(item.WorkingStatus) }]}>
                        {item.WorkingStatus?.trim() || 'N/A'}
                      </Text>
                    </View>
                    
                    {item.VisitType && (
                      <View style={styles.visitTypeBadge}>
                        <Ionicons 
                          name={item.VisitType.toLowerCase().includes('wfh') ? 'home-outline' : 'business-outline'} 
                          size={16} 
                          color="#6264A7" 
                        />
                        <Text style={styles.visitTypeText}>{item.VisitType?.trim()}</Text>
                      </View>
                    )}
                  </View>
                  {renderInfoRow("person", "Accompanied By", item.AccompaniedBy &&  item.AccompaniedBy)}
                  {renderInfoRow("location-city", "City", item.City)}
                  {renderInfoRow("person-outline", "Contact Person", item.ContactPerson)}
                  {renderInfoRow("business", "Customer", item.Customer)}
                  {renderInfoRow("description", "Details", item.DetailsOfWorks)}
                  {renderInfoRow("build", "Instrument", item.Instrument)}
                  {renderInfoRow("assignment", "Job Code", item.JobCode)}
                  {renderInfoRow("info", "Job Status", item.JobStatus)}
                  {renderInfoRow("category", "Job Type", item.JobType)}
                  {renderInfoRow("pin", "Serial No", item.SerialNo)}
                </LinearGradient>
              </View>
            ))}
            <View style={styles.footerWrapper}>
              <Footer />
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyMainContainer}>
            <View style={styles.emptyContentContainer}>
              <MaterialIcons 
                name="assignment-late" 
                size={70} 
                color="#6264A7" 
                style={styles.emptyIcon} 
              />
              <Text style={styles.emptyTitle}>No Job Records Found</Text>
              <Text style={styles.emptyDescription}>
                We couldn't find any job registers for {employeeName}.
              </Text>
              <View style={styles.reasonsContainer}>
                <View style={styles.reasonRow}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.reasonText}>Employee might be newly registered</Text>
                </View>
                <View style={styles.reasonRow}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.reasonText}>No jobs have been assigned yet</Text>
                </View>
                <View style={styles.reasonRow}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.reasonText}>There might be a filter active</Text>
                </View>
              </View>
            </View>
            <View style={styles.emptyFooterWrapper}>
              <Footer />
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#201F1F',
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(98, 100, 167, 0.2)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  employeeName: {
    fontSize: 16,
    color: '#6264A7',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(98, 100, 167, 0.2)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoContent: {
    flexDirection: 'row',
    marginLeft: 8,
    flex: 1,
  },
  infoLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  infoValue: {
    color: '#C8C6C4',
    fontSize: 14,
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  visitTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(98, 100, 167, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  visitTypeText: {
    color: '#6264A7',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  // Empty state styles
  emptyMainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  emptyContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -40, // Adjust this value to move content up or down
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.9,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: '#C8C6C4',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  reasonsContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 40,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6264A7',
    marginRight: 12,
  },
  reasonText: {
    fontSize: 14,
    color: '#C8C6C4',
    lineHeight: 20,
    flex: 1,
  },
  footerWrapper: {
    paddingEnd: 10,
    backgroundColor: 'transparent',
  },
  emptyFooterWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default Employee_job_Report;